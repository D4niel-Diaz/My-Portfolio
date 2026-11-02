/** Shared motion values for CSS reveals and the existing gallery/lightbox. */
export const DURATION = {
    fast: 0.2,
    base: 0.24,
    slow: 0.5,
} as const;

export const EASE_OUT_QUINT = [0.22, 1, 0.36, 1] as const;
export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const;
export const REVEAL_DISTANCE = 14;
export const REVEAL_THRESHOLD = 0.05;
export const REVEAL_ROOT_MARGIN = "0px 0px -8% 0px";
export const STAGGER_INTERVAL = 0.08;
