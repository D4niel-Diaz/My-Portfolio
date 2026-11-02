"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { REVEAL_ROOT_MARGIN, REVEAL_THRESHOLD } from "@/lib/motion";

const MAX_STAGGER = 6;

export function RevealRoot() {
    const pathname = usePathname();

    useEffect(() => {
        const root = document.documentElement;
        if (!root.classList.contains("motion-ready")) return;

        let observer: IntersectionObserver;
        try {
            observer = new IntersectionObserver(
                (entries) => {
                    const entering = entries
                        .filter((entry) => entry.isIntersecting)
                        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left);
                    entering.forEach((entry, index) => {
                        const element = entry.target as HTMLElement;
                        element.style.setProperty("--reveal-index", String(Math.min(index, MAX_STAGGER)));
                        element.classList.add("is-visible");
                        observer.unobserve(element);
                    });
                },
                { rootMargin: REVEAL_ROOT_MARGIN, threshold: REVEAL_THRESHOLD }
            );
        } catch {
            root.classList.remove("motion-ready", "motion-active");
            return;
        }

        root.classList.add("motion-active");
        document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((element) => observer.observe(element));
        return () => {
            observer.disconnect();
            root.classList.remove("motion-active");
        };
    }, [pathname]);

    return null;
}
