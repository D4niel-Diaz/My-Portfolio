"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { REVEAL_MARGIN } from "@/lib/motion";

/**
 * The scroll reveal every section shares: fires once, slightly before the
 * element reaches the viewport edge.
 *
 * `animate` is the variant name to hand to the section's own wrapper; `isInView`
 * is exposed separately because nested stagger parents have to be driven from
 * the same trigger rather than each running their own observer.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
    const ref = useRef<T>(null);
    const isInView = useInView(ref, { once: true, margin: REVEAL_MARGIN });

    return { ref, isInView, animate: isInView ? "visible" : "hidden" } as const;
}
