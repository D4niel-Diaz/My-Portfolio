"use client";

import {
    memo,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type Key,
    type ReactNode,
    type RefObject,
} from "react";

/**
 * LogoLoop — an infinitely scrolling marquee of logos.
 *
 * Ported from React Bits (https://reactbits.dev) to TypeScript to match the
 * rest of this codebase. Behaviour is unchanged from the original apart from
 * two deliberate fixes, both marked inline:
 *   1. initial measurements are deferred to the next frame, so the hooks don't
 *      call setState synchronously inside an effect body;
 *   2. the effects key off a primitive layout signature rather than freshly
 *      allocated arrays, so they don't re-subscribe on every render.
 */

const ANIMATION_CONFIG = {
    SMOOTH_TAU: 0.25,
    MIN_COPIES: 2,
    COPY_HEADROOM: 2,
} as const;

type LogoItemBase = {
    href?: string;
    title?: string;
    ariaLabel?: string;
};

export type LogoNodeItem = LogoItemBase & { node: ReactNode };

export type LogoImageItem = LogoItemBase & {
    src: string;
    srcSet?: string;
    sizes?: string;
    width?: number;
    height?: number;
    alt?: string;
};

export type LogoItem = LogoNodeItem | LogoImageItem;

export type LogoLoopDirection = "left" | "right" | "up" | "down";

export interface LogoLoopProps {
    logos: LogoItem[];
    /** Pixels per second. Negative reverses `direction`. */
    speed?: number;
    direction?: LogoLoopDirection;
    width?: number | string;
    logoHeight?: number;
    gap?: number;
    /** Speed while hovered. 0 pauses; a lower number decelerates. */
    hoverSpeed?: number;
    /** Legacy switch kept for compatibility; `hoverSpeed` wins if both are set. */
    pauseOnHover?: boolean;
    fadeOut?: boolean;
    /** Any CSS colour, including a `var(--…)` reference for theme awareness. */
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    renderItem?: (item: LogoItem, key: Key) => ReactNode;
    ariaLabel?: string;
    className?: string;
    style?: CSSProperties;
}

const toCssLength = (value?: number | string) =>
    typeof value === "number" ? `${value}px` : value ?? undefined;

const cx = (...parts: Array<string | false | undefined>) =>
    parts.filter(Boolean).join(" ");

const isNodeItem = (item: LogoItem): item is LogoNodeItem => "node" in item;

/**
 * Re-measure whenever any observed element resizes.
 *
 * `signature` is a primitive describing the layout inputs — passing the raw
 * arrays would re-subscribe on every render, since they're new objects each time.
 */
function useResizeObserver(
    callback: () => void,
    refs: readonly RefObject<HTMLElement | null>[],
    signature: string
) {
    useEffect(() => {
        // Deferred to the next frame: `callback` sets state, and doing that
        // synchronously in an effect body triggers a cascading render.
        const raf = requestAnimationFrame(callback);

        if (!window.ResizeObserver) {
            window.addEventListener("resize", callback);
            return () => {
                cancelAnimationFrame(raf);
                window.removeEventListener("resize", callback);
            };
        }

        const observers = refs.map((ref) => {
            if (!ref.current) return null;
            const observer = new ResizeObserver(callback);
            observer.observe(ref.current);
            return observer;
        });

        return () => {
            cancelAnimationFrame(raf);
            observers.forEach((observer) => observer?.disconnect());
        };
    }, [callback, refs, signature]);
}

/** Logos can't be measured until their images have decoded. */
function useImageLoader(
    seqRef: RefObject<HTMLElement | null>,
    onLoad: () => void,
    signature: string
) {
    useEffect(() => {
        const images = Array.from(seqRef.current?.querySelectorAll("img") ?? []);

        if (images.length === 0) {
            const raf = requestAnimationFrame(onLoad);
            return () => cancelAnimationFrame(raf);
        }

        let remaining = images.length;
        const handleImageLoad = () => {
            remaining -= 1;
            if (remaining === 0) onLoad();
        };

        images.forEach((img) => {
            if (img.complete) {
                handleImageLoad();
            } else {
                img.addEventListener("load", handleImageLoad, { once: true });
                img.addEventListener("error", handleImageLoad, { once: true });
            }
        });

        return () => {
            images.forEach((img) => {
                img.removeEventListener("load", handleImageLoad);
                img.removeEventListener("error", handleImageLoad);
            });
        };
    }, [onLoad, seqRef, signature]);
}

/** Drives the transform directly on the DOM node — never through React state. */
function useAnimationLoop(
    trackRef: RefObject<HTMLDivElement | null>,
    targetVelocity: number,
    seqWidth: number,
    seqHeight: number,
    isHovered: boolean,
    hoverSpeed: number | undefined,
    isVertical: boolean
) {
    const rafRef = useRef<number | null>(null);
    const lastTimestampRef = useRef<number | null>(null);
    const offsetRef = useRef(0);
    const velocityRef = useRef(0);

    useEffect(() => {
        const track = trackRef.current;
        if (!track) return;

        const prefersReduced = window.matchMedia?.(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const seqSize = isVertical ? seqHeight : seqWidth;

        const applyOffset = () => {
            track.style.transform = isVertical
                ? `translate3d(0, ${-offsetRef.current}px, 0)`
                : `translate3d(${-offsetRef.current}px, 0, 0)`;
        };

        if (seqSize > 0) {
            offsetRef.current = ((offsetRef.current % seqSize) + seqSize) % seqSize;
            applyOffset();
        }

        // Reduced motion: park the logos and never start the loop.
        if (prefersReduced) {
            track.style.transform = "translate3d(0, 0, 0)";
            return () => {
                lastTimestampRef.current = null;
            };
        }

        const animate = (timestamp: number) => {
            if (lastTimestampRef.current === null) lastTimestampRef.current = timestamp;

            const deltaTime =
                Math.max(0, timestamp - lastTimestampRef.current) / 1000;
            lastTimestampRef.current = timestamp;

            const target =
                isHovered && hoverSpeed !== undefined ? hoverSpeed : targetVelocity;

            // Exponential smoothing, so hovering eases rather than snaps.
            const easingFactor = 1 - Math.exp(-deltaTime / ANIMATION_CONFIG.SMOOTH_TAU);
            velocityRef.current += (target - velocityRef.current) * easingFactor;

            if (seqSize > 0) {
                const nextOffset = offsetRef.current + velocityRef.current * deltaTime;
                offsetRef.current = ((nextOffset % seqSize) + seqSize) % seqSize;
                applyOffset();
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
                rafRef.current = null;
            }
            lastTimestampRef.current = null;
        };
    }, [
        targetVelocity,
        seqWidth,
        seqHeight,
        isHovered,
        hoverSpeed,
        isVertical,
        trackRef,
    ]);
}

export const LogoLoop = memo(function LogoLoop({
    logos,
    speed = 120,
    direction = "left",
    width = "100%",
    logoHeight = 28,
    gap = 32,
    pauseOnHover,
    hoverSpeed,
    fadeOut = false,
    fadeOutColor,
    scaleOnHover = false,
    renderItem,
    ariaLabel = "Partner logos",
    className,
    style,
}: LogoLoopProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const trackRef = useRef<HTMLDivElement>(null);
    const seqRef = useRef<HTMLUListElement>(null);

    const [seqWidth, setSeqWidth] = useState(0);
    const [seqHeight, setSeqHeight] = useState(0);
    const [copyCount, setCopyCount] = useState<number>(ANIMATION_CONFIG.MIN_COPIES);
    const [isHovered, setIsHovered] = useState(false);

    const effectiveHoverSpeed = useMemo(() => {
        if (hoverSpeed !== undefined) return hoverSpeed;
        if (pauseOnHover === false) return undefined;
        return 0;
    }, [hoverSpeed, pauseOnHover]);

    const isVertical = direction === "up" || direction === "down";

    const targetVelocity = useMemo(() => {
        const magnitude = Math.abs(speed);
        const directionMultiplier = isVertical
            ? direction === "up"
                ? 1
                : -1
            : direction === "left"
                ? 1
                : -1;
        const speedMultiplier = speed < 0 ? -1 : 1;
        return magnitude * directionMultiplier * speedMultiplier;
    }, [speed, direction, isVertical]);

    const updateDimensions = useCallback(() => {
        const containerWidth = containerRef.current?.clientWidth ?? 0;
        const sequenceRect = seqRef.current?.getBoundingClientRect();
        const sequenceWidth = sequenceRect?.width ?? 0;
        const sequenceHeight = sequenceRect?.height ?? 0;

        if (isVertical) {
            const parentHeight = containerRef.current?.parentElement?.clientHeight ?? 0;
            if (containerRef.current && parentHeight > 0) {
                const targetHeight = Math.ceil(parentHeight);
                if (containerRef.current.style.height !== `${targetHeight}px`) {
                    containerRef.current.style.height = `${targetHeight}px`;
                }
            }
            if (sequenceHeight > 0) {
                setSeqHeight(Math.ceil(sequenceHeight));
                const viewport = containerRef.current?.clientHeight || parentHeight || sequenceHeight;
                const copiesNeeded =
                    Math.ceil(viewport / sequenceHeight) + ANIMATION_CONFIG.COPY_HEADROOM;
                setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
            }
        } else if (sequenceWidth > 0) {
            setSeqWidth(Math.ceil(sequenceWidth));
            const copiesNeeded =
                Math.ceil(containerWidth / sequenceWidth) + ANIMATION_CONFIG.COPY_HEADROOM;
            setCopyCount(Math.max(ANIMATION_CONFIG.MIN_COPIES, copiesNeeded));
        }
    }, [isVertical]);

    // Stable identity: a fresh array here would re-subscribe every render.
    const observedRefs = useMemo(
        () => [containerRef, seqRef] as const,
        []
    );
    const layoutSignature = `${logos.length}|${gap}|${logoHeight}|${isVertical}`;

    useResizeObserver(updateDimensions, observedRefs, layoutSignature);
    useImageLoader(seqRef, updateDimensions, layoutSignature);
    useAnimationLoop(
        trackRef,
        targetVelocity,
        seqWidth,
        seqHeight,
        isHovered,
        effectiveHoverSpeed,
        isVertical
    );

    const cssVariables = useMemo(
        () =>
        ({
            "--logoloop-gap": `${gap}px`,
            "--logoloop-logoHeight": `${logoHeight}px`,
            ...(fadeOutColor && { "--logoloop-fadeColor": fadeOutColor }),
        } as CSSProperties),
        [gap, logoHeight, fadeOutColor]
    );

    const rootClasses = useMemo(
        () =>
            cx(
                "relative group",
                isVertical ? "overflow-hidden h-full inline-block" : "overflow-x-hidden",
                "[--logoloop-fadeColorAuto:#ffffff]",
                "dark:[--logoloop-fadeColorAuto:#0b0b0b]",
                scaleOnHover && "py-[calc(var(--logoloop-logoHeight)*0.1)]",
                className
            ),
        [isVertical, scaleOnHover, className]
    );

    const handleMouseEnter = useCallback(() => {
        if (effectiveHoverSpeed !== undefined) setIsHovered(true);
    }, [effectiveHoverSpeed]);

    const handleMouseLeave = useCallback(() => {
        if (effectiveHoverSpeed !== undefined) setIsHovered(false);
    }, [effectiveHoverSpeed]);

    const itemClasses = useCallback(
        () =>
            cx(
                "flex-none text-[length:var(--logoloop-logoHeight)] leading-[1]",
                isVertical ? "mb-[var(--logoloop-gap)]" : "mr-[var(--logoloop-gap)]",
                scaleOnHover && "overflow-visible group/item"
            ),
        [isVertical, scaleOnHover]
    );

    const renderLogoItem = useCallback(
        (item: LogoItem, key: Key) => {
            if (renderItem) {
                return (
                    <li className={itemClasses()} key={key}>
                        {renderItem(item, key)}
                    </li>
                );
            }

            const scaleClasses =
                scaleOnHover &&
                "transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/item:scale-120";

            const content = isNodeItem(item) ? (
                <span
                    className={cx(
                        "inline-flex items-center",
                        "motion-reduce:transition-none",
                        scaleClasses
                    )}
                    aria-hidden={!!item.href && !item.ariaLabel}
                >
                    {item.node}
                </span>
            ) : (
                // Plain <img> on purpose: this branch takes arbitrary logo URLs
                // from the caller, which next/image can't optimise unless every
                // host is declared in next.config remotePatterns.
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    className={cx(
                        "h-[var(--logoloop-logoHeight)] w-auto block object-contain",
                        "[-webkit-user-drag:none] pointer-events-none",
                        "[image-rendering:-webkit-optimize-contrast]",
                        "motion-reduce:transition-none",
                        scaleClasses
                    )}
                    src={item.src}
                    srcSet={item.srcSet}
                    sizes={item.sizes}
                    width={item.width}
                    height={item.height}
                    alt={item.alt ?? ""}
                    title={item.title}
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                />
            );

            const itemAriaLabel = isNodeItem(item)
                ? item.ariaLabel ?? item.title
                : item.alt ?? item.title;

            const inner = item.href ? (
                <a
                    className={cx(
                        "inline-flex items-center no-underline rounded",
                        "transition-opacity duration-200 ease-linear",
                        "hover:opacity-80",
                        "focus-visible:outline focus-visible:outline-current focus-visible:outline-offset-2"
                    )}
                    href={item.href}
                    aria-label={itemAriaLabel || "logo link"}
                    target="_blank"
                    rel="noreferrer noopener"
                >
                    {content}
                </a>
            ) : (
                content
            );

            return (
                <li className={itemClasses()} key={key}>
                    {inner}
                </li>
            );
        },
        [itemClasses, scaleOnHover, renderItem]
    );

    const logoLists = useMemo(
        () =>
            Array.from({ length: copyCount }, (_, copyIndex) => (
                <ul
                    className={cx("flex items-center", isVertical && "flex-col")}
                    key={`copy-${copyIndex}`}
                    // Only the first copy is real content; the rest are visual
                    // padding and must not be announced twice.
                    aria-hidden={copyIndex > 0}
                    ref={copyIndex === 0 ? seqRef : undefined}
                >
                    {logos.map((item, itemIndex) =>
                        renderLogoItem(item, `${copyIndex}-${itemIndex}`)
                    )}
                </ul>
            )),
        [copyCount, logos, renderLogoItem, isVertical]
    );

    const containerStyle = useMemo<CSSProperties>(
        () => ({
            width: isVertical
                ? toCssLength(width) === "100%"
                    ? undefined
                    : toCssLength(width)
                : toCssLength(width) ?? "100%",
            ...cssVariables,
            ...style,
        }),
        [width, cssVariables, style, isVertical]
    );

    return (
        <div
            ref={containerRef}
            className={rootClasses}
            style={containerStyle}
            role="region"
            aria-label={ariaLabel}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {fadeOut && (
                <>
                    {isVertical ? (
                        <>
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[clamp(24px,8%,120px)] bg-[linear-gradient(to_bottom,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
                            />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[clamp(24px,8%,120px)] bg-[linear-gradient(to_top,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
                            />
                        </>
                    ) : (
                        <>
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_right,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
                            />
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[clamp(24px,8%,120px)] bg-[linear-gradient(to_left,var(--logoloop-fadeColor,var(--logoloop-fadeColorAuto))_0%,rgba(0,0,0,0)_100%)]"
                            />
                        </>
                    )}
                </>
            )}

            <div
                className={cx(
                    "flex will-change-transform select-none relative z-0",
                    "motion-reduce:transform-none",
                    isVertical ? "flex-col h-max w-full" : "flex-row w-max"
                )}
                ref={trackRef}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {logoLists}
            </div>
        </div>
    );
});

LogoLoop.displayName = "LogoLoop";

export default LogoLoop;
