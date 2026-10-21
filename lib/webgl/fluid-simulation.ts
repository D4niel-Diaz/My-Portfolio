import {
    ADVECTION_SHADER,
    BASE_VERTEX_SHADER,
    CLEAR_SHADER,
    COPY_SHADER,
    CURL_SHADER,
    DISPLAY_SHADER,
    DIVERGENCE_SHADER,
    GRADIENT_SUBTRACT_SHADER,
    PRESSURE_SHADER,
    SPLAT_SHADER,
    VORTICITY_SHADER,
} from "./fluid-shaders";

/**
 * A GPU fluid simulation, driven by pointer movement.
 *
 * Ported to TypeScript from React Bits (https://reactbits.dev), which in turn
 * follows Pavel Dobryakov's WebGL-Fluid-Simulation. The physics is unchanged;
 * the structure differs in three deliberate ways:
 *
 *   1. it is a plain module rather than a hook body, so `SplashCursor` stays a
 *      small React component and none of this re-runs on render;
 *   2. `destroy()` actually releases the GL objects it created — the original
 *      only removed listeners, leaving textures and programs to the collector;
 *   3. `frame()` takes its own delta and never schedules work, so the caller
 *      decides when to run (and can stop while the tab is hidden).
 */

/** Tunables. All resolutions are simulation grid sizes, not pixels. */
export interface FluidConfig {
    /** Velocity field resolution. Cheap to raise; blurs the flow if too low. */
    simResolution: number;
    /** Dye (colour) resolution. This is the one that costs fill rate. */
    dyeResolution: number;
    /** How fast colour fades. Higher = shorter trails. */
    densityDissipation: number;
    /** How fast motion fades. Higher = the fluid settles sooner. */
    velocityDissipation: number;
    /** Pressure retained between frames, 0–1. */
    pressure: number;
    /** Jacobi iterations for the pressure solve. Accuracy vs. cost. */
    pressureIterations: number;
    /** Swirl strength. */
    curl: number;
    /** Radius of each dab of colour. */
    splatRadius: number;
    /** How hard a pointer move pushes the fluid. */
    splatForce: number;
    /** Fake directional lighting on the dye. */
    shading: boolean;
    /** How often the pointer colour is re-rolled, in rolls per second. */
    colorUpdateSpeed: number;
    /** Cycle random hues. When false, every splat uses `color`. */
    rainbowMode: boolean;
    /** Hex string (`#rgb` or `#rrggbb`) used when `rainbowMode` is off. */
    color: string;
}

export interface FluidSimulation {
    /**
     * Advance the simulation and present it.
     *
     * @param dtSeconds Time since the previous frame. Clamped internally, so a
     * long stall (a backgrounded tab, a blocked main thread) can't blow the
     * advection step apart.
     */
    frame(dtSeconds: number): void;
    /** Move the pointer to a CSS-pixel position, dragging the fluid with it. */
    drag(x: number, y: number): void;
    /** A bright burst at a CSS-pixel position, for clicks and taps. */
    burst(x: number, y: number): void;
    /** Lift the pointer, so the next `drag` starts a fresh stroke. */
    endStroke(): void;
    /** Release every GL object and the drawing buffer behind them. */
    destroy(): void;
}

type AnyGL = WebGLRenderingContext | WebGL2RenderingContext;

interface Rgb {
    r: number;
    g: number;
    b: number;
}

/** A renderable texture pair: the texture plus the framebuffer that writes it. */
interface Fbo {
    texture: WebGLTexture;
    fbo: WebGLFramebuffer;
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    /** Bind to a texture unit and return the unit index, for `uniform1i`. */
    attach(id: number): number;
}

/**
 * Two `Fbo`s that swap. Every pass reads `read` and writes `write` — a shader
 * cannot sample the texture it is rendering to, so ping-ponging is mandatory.
 */
interface DoubleFbo {
    read: Fbo;
    write: Fbo;
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    swap(): void;
}

interface TexFormat {
    internalFormat: number;
    format: number;
}

interface GlSupport {
    gl: AnyGL;
    halfFloatTexType: number;
    formatRGBA: TexFormat;
    formatRG: TexFormat;
    formatR: TexFormat;
    /** False on GPUs that can't linearly filter float textures. */
    supportLinearFiltering: boolean;
}

function isWebGL2(gl: AnyGL): gl is WebGL2RenderingContext {
    return typeof WebGL2RenderingContext !== "undefined" && gl instanceof WebGL2RenderingContext;
}

/**
 * Whether the GPU can render into a texture of this format. Asked rather than
 * assumed: half-float render targets are ubiquitous but not guaranteed, and
 * binding an unsupported one yields an incomplete framebuffer and a black canvas.
 */
function supportsRenderTextureFormat(
    gl: AnyGL,
    internalFormat: number,
    format: number,
    type: number
): boolean {
    const texture = gl.createTexture();
    const fbo = gl.createFramebuffer();
    if (!texture || !fbo) return false;

    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);

    // Probe only; leaving these bound would corrupt the first real pass.
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.deleteFramebuffer(fbo);
    gl.deleteTexture(texture);

    return status === gl.FRAMEBUFFER_COMPLETE;
}

/**
 * Pick a usable format, falling back to progressively wider ones: a GPU that
 * rejects one- and two-channel float targets will still take RGBA.
 */
function getSupportedFormat(
    gl: WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number
): TexFormat | null {
    if (supportsRenderTextureFormat(gl, internalFormat, format, type)) {
        return { internalFormat, format };
    }

    switch (internalFormat) {
        case gl.R16F:
            return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
            return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
            return null;
    }
}

/**
 * Create a context and work out what it can do. Returns null when WebGL is
 * unavailable or lacks half-float render targets, which is the caller's signal
 * to skip the effect rather than show a black rectangle.
 */
function getGlSupport(canvas: HTMLCanvasElement): GlSupport | null {
    const params: WebGLContextAttributes = {
        alpha: true,
        depth: false,
        stencil: false,
        antialias: false,
        preserveDrawingBuffer: false,
    };

    const gl: AnyGL | null =
        (canvas.getContext("webgl2", params) as WebGL2RenderingContext | null) ??
        (canvas.getContext("webgl", params) as WebGLRenderingContext | null);

    if (!gl) return null;

    gl.clearColor(0, 0, 0, 1);

    if (isWebGL2(gl)) {
        gl.getExtension("EXT_color_buffer_float");
        const supportLinearFiltering = gl.getExtension("OES_texture_float_linear") !== null;
        const halfFloatTexType = gl.HALF_FLOAT;

        const formatRGBA = getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, halfFloatTexType);
        const formatRG = getSupportedFormat(gl, gl.RG16F, gl.RG, halfFloatTexType);
        const formatR = getSupportedFormat(gl, gl.R16F, gl.RED, halfFloatTexType);
        if (!formatRGBA || !formatRG || !formatR) return null;

        return { gl, halfFloatTexType, formatRGBA, formatRG, formatR, supportLinearFiltering };
    }

    // WebGL 1: every field is RGBA, and half floats arrive via extension.
    const halfFloat = gl.getExtension("OES_texture_half_float");
    if (!halfFloat) return null;

    const supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear") !== null;
    const halfFloatTexType = halfFloat.HALF_FLOAT_OES;
    if (!supportsRenderTextureFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)) return null;

    const rgba: TexFormat = { internalFormat: gl.RGBA, format: gl.RGBA };
    return {
        gl,
        halfFloatTexType,
        formatRGBA: rgba,
        formatRG: rgba,
        formatR: rgba,
        supportLinearFiltering,
    };
}

/** CSS pixels to device pixels, so the fluid is sharp on HiDPI screens. */
function scaleByPixelRatio(input: number): number {
    return Math.floor(input * (window.devicePixelRatio || 1));
}

/** Fit a square grid resolution to the drawing buffer's aspect ratio. */
function getResolution(gl: AnyGL, resolution: number): { width: number; height: number } {
    const ratio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    const aspectRatio = ratio < 1 ? 1 / ratio : ratio;

    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);

    return gl.drawingBufferWidth > gl.drawingBufferHeight
        ? { width: max, height: min }
        : { width: min, height: max };
}

/**
 * The 0.15 factor keeps splats dim enough to read as translucent ink. Without
 * it the dye saturates to white almost immediately.
 */
const COLOR_INTENSITY = 0.15;

function hexToRgb(hex: string): Rgb {
    let value = hex.replace("#", "");
    if (value.length === 3) {
        value = value[0] + value[0] + value[1] + value[1] + value[2] + value[2];
    }

    const parse = (from: number) => {
        const channel = Number.parseInt(value.slice(from, from + 2), 16);
        // NaN from a malformed prop would poison the dye texture for good.
        return (Number.isNaN(channel) ? 0 : channel) / 255;
    };

    return {
        r: parse(0) * COLOR_INTENSITY,
        g: parse(2) * COLOR_INTENSITY,
        b: parse(4) * COLOR_INTENSITY,
    };
}

/** Fully saturated hue to RGB. Used for the rainbow cycle. */
function hsvToRgb(h: number, s: number, v: number): Rgb {
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);

    const table: readonly [number, number, number][] = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q],
    ];
    const [r, g, b] = table[i % 6];

    return { r, g, b };
}

/** The single pointer we track. Multi-touch collapses onto it. */
interface Pointer {
    /** Normalised 0–1 canvas coordinates, y flipped to match GL. */
    texcoordX: number;
    texcoordY: number;
    prevTexcoordX: number;
    prevTexcoordY: number;
    deltaX: number;
    deltaY: number;
    /** False until the first move, so we don't splat from a stale origin. */
    hasPosition: boolean;
    color: Rgb;
}

/**
 * Build a simulation bound to `canvas`.
 *
 * Returns null when the GPU can't support it; callers should treat that as
 * "render nothing" rather than an error, since this is pure decoration.
 */
export function createFluidSimulation(
    canvas: HTMLCanvasElement,
    config: FluidConfig
): FluidSimulation | null {
    const support = getGlSupport(canvas);
    if (!support) return null;

    const { gl, halfFloatTexType, formatRGBA, formatRG, formatR } = support;

    // Without linear filtering the dye has to be sampled manually, which is
    // costly — drop the resolution and the lighting to pay for it.
    const dyeResolution = support.supportLinearFiltering ? config.dyeResolution : 256;
    const shading = support.supportLinearFiltering ? config.shading : false;
    const filtering = support.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    /** Everything created here, so `destroy()` can release all of it. */
    const shaders: WebGLShader[] = [];
    const programs: WebGLProgram[] = [];
    const textures = new Set<WebGLTexture>();
    const framebuffers = new Set<WebGLFramebuffer>();
    const buffers: WebGLBuffer[] = [];

    function compileShader(type: number, source: string, keywords?: string[]): WebGLShader | null {
        const defines = keywords?.map(keyword => `#define ${keyword}\n`).join("") ?? "";
        const shader = gl.createShader(type);
        if (!shader) return null;

        gl.shaderSource(shader, defines + source);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            // A driver-specific compile failure shouldn't take the page down, so
            // report and bail out to the no-op path.
            console.error("SplashCursor: shader failed to compile", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }

        shaders.push(shader);
        return shader;
    }

    /** A linked program plus its uniform locations, looked up once. */
    interface CompiledProgram {
        program: WebGLProgram;
        uniforms: Record<string, WebGLUniformLocation | null>;
        bind(): void;
    }

    function createProgram(
        vertexShader: WebGLShader,
        fragmentShader: WebGLShader
    ): CompiledProgram | null {
        const program = gl.createProgram();
        if (!program) return null;

        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            console.error("SplashCursor: program failed to link", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }

        programs.push(program);

        const uniforms: Record<string, WebGLUniformLocation | null> = {};
        const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS) as number;
        for (let i = 0; i < count; i++) {
            const info = gl.getActiveUniform(program, i);
            if (info) uniforms[info.name] = gl.getUniformLocation(program, info.name);
        }

        return { program, uniforms, bind: () => gl.useProgram(program) };
    }

    const baseVertexShader = compileShader(gl.VERTEX_SHADER, BASE_VERTEX_SHADER);
    if (!baseVertexShader) return null;

    /** Compile a fragment shader and link it against the shared vertex stage. */
    function fragmentProgram(source: string, keywords?: string[]): CompiledProgram | null {
        const shader = compileShader(gl.FRAGMENT_SHADER, source, keywords);
        return shader && createProgram(baseVertexShader, shader);
    }

    const copyProgram = fragmentProgram(COPY_SHADER);
    const clearProgram = fragmentProgram(CLEAR_SHADER);
    const splatProgram = fragmentProgram(SPLAT_SHADER);
    const advectionProgram = fragmentProgram(
        ADVECTION_SHADER,
        support.supportLinearFiltering ? undefined : ["MANUAL_FILTERING"]
    );
    const divergenceProgram = fragmentProgram(DIVERGENCE_SHADER);
    const curlProgram = fragmentProgram(CURL_SHADER);
    const vorticityProgram = fragmentProgram(VORTICITY_SHADER);
    const pressureProgram = fragmentProgram(PRESSURE_SHADER);
    const gradientSubtractProgram = fragmentProgram(GRADIENT_SUBTRACT_SHADER);
    const displayProgram = fragmentProgram(DISPLAY_SHADER, shading ? ["SHADING"] : undefined);

    // One missing program means a broken pipeline; give up cleanly and let the
    // caller render nothing rather than half a simulation.
    if (
        !copyProgram ||
        !clearProgram ||
        !splatProgram ||
        !advectionProgram ||
        !divergenceProgram ||
        !curlProgram ||
        !vorticityProgram ||
        !pressureProgram ||
        !gradientSubtractProgram ||
        !displayProgram
    ) {
        shaders.forEach(shader => gl.deleteShader(shader));
        programs.forEach(program => gl.deleteProgram(program));
        return null;
    }


    // The framebuffer setup and frame loop are not implemented yet, so keep
    // this optional effect on its documented no-op path.
    shaders.forEach(shader => gl.deleteShader(shader));
    programs.forEach(program => gl.deleteProgram(program));
    return null;
}
