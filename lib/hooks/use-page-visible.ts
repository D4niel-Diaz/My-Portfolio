"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
    document.addEventListener("visibilitychange", onChange);
    return () => document.removeEventListener("visibilitychange", onChange);
}

/**
 * Whether the tab is currently in the foreground.
 *
 * Carousels and clocks use this to stop doing work nobody can see — a
 * backgrounded tab that keeps re-rendering every second is pure battery drain,
 * and the visitor comes back to a slideshow that has silently moved on.
 */
export function usePageVisible() {
    return useSyncExternalStore(
        subscribe,
        () => !document.hidden,
        // Assume visible on the server; the first client read corrects it.
        () => true
    );
}
