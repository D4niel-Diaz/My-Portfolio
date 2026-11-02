"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

export function SmoothScroll() {
    const lenisRef = useRef<Lenis | null>(null);
    const pathname = usePathname();

    useEffect(() => {
        const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
        let observer: MutationObserver | null = null;

        const syncModalState = () => {
            const modalOpen = document.querySelector("dialog[open], [aria-modal='true']") !== null;
            if (modalOpen) lenisRef.current?.stop();
            else lenisRef.current?.start();
        };

        const start = () => {
            if (motionPreference.matches || lenisRef.current) return;
            lenisRef.current = new Lenis({
                lerp: 0.1,
                autoRaf: true,
                anchors: true,
                smoothWheel: true,
                syncTouch: false,
                stopInertiaOnNavigate: true,
            });
            observer = new MutationObserver(syncModalState);
            observer.observe(document.body, {
                subtree: true,
                childList: true,
                attributes: true,
                attributeFilter: ["open", "aria-modal"],
            });
            syncModalState();
        };

        const stop = () => {
            observer?.disconnect();
            observer = null;
            lenisRef.current?.destroy();
            lenisRef.current = null;
        };

        const onMotionChange = () => motionPreference.matches ? stop() : start();
        start();
        motionPreference.addEventListener("change", onMotionChange);
        return () => {
            motionPreference.removeEventListener("change", onMotionChange);
            stop();
        };
    }, []);

    useEffect(() => {
        lenisRef.current?.resize();
    }, [pathname]);

    return null;
}
