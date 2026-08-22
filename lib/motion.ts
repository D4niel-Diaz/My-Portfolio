import { Variants, Transition } from "framer-motion";

/**
 * The single home for easings, durations and variants, so timings only have to
 * be tuned in one place.
 */

/** Ease-out quint — long, soft settle. Overlays, stage transitions. */
export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;

/** Ease-out expo — snappier start, used for small UI (chips, tiles). */
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;

export const DURATION = {
    fast: 0.18,
    base: 0.32,
    slow: 0.5,
} as const;

/** Spring for anything that follows a drag or a pointer. */
export const SPRING: Transition = {
    type: "spring",
    stiffness: 320,
    damping: 34,
    mass: 0.8,
};

/**
 * Stagger container whose children animate in sequence.
 *
 * `stagger` is per-child delay; pass a smaller value for long lists so the
 * last item doesn't arrive noticeably late.
 */
export function staggerParent(stagger = 0.06, delayChildren = 0): Variants {
    return {
        hidden: {},
        visible: {
            transition: { staggerChildren: stagger, delayChildren },
        },
    };
}

/** Child of `staggerParent`. Rises and fades. */
export const riseItem: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT_QUINT },
    },
};

/** Child of `staggerParent`. Scales up from slightly small — for tiles/chips. */
export const popItem: Variants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: DURATION.base, ease: EASE_OUT_EXPO },
    },
};

/**
 * Strip motion from a variant set when the user has asked for reduced motion:
 * elements still fade, they just don't travel or scale.
 *
 * Pass the result of `useReducedMotion()` — Framer reads the OS-level
 * `prefers-reduced-motion` media query.
 */
export function respectMotion(variants: Variants, reduced: boolean | null): Variants {
    if (!reduced) return variants;
    return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: DURATION.fast } },
    };
}

/** Viewport margin used by every section's scroll reveal. */
export const REVEAL_MARGIN = "-60px";

/** The reveal applied to a whole section as it scrolls into view. */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: "easeOut" },
    },
};

/** Hero-only parent: the hero animates on mount rather than on scroll. */
export const staggerContainer: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1,
        },
    },
};
