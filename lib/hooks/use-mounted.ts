"use client";

import { useSyncExternalStore } from "react";

/** Never fires — the value below is constant per environment. */
const subscribe = () => () => { };

/**
 * False during SSR and the first client render, true afterwards.
 *
 * Guards anything that touches `document` or `window` — portals, themes,
 * locale-formatted dates — so the server and client markup match.
 *
 * useSyncExternalStore rather than the usual useState + useEffect: it gets the
 * server and client snapshots from React directly, without a setState in an
 * effect body and the extra render that causes.
 */
export function useMounted() {
    return useSyncExternalStore(
        subscribe,
        () => true,
        () => false
    );
}
