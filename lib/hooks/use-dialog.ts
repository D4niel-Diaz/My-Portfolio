"use client";

import { RefObject, useEffect } from "react";

const FOCUSABLE =
    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface UseDialogOptions {
    open: boolean;
    onClose: () => void;
    /** The dialog element. Tab is trapped inside it. */
    containerRef: RefObject<HTMLElement | null>;
    /** Focused when the dialog opens. Falls back to the first focusable child. */
    initialFocusRef?: RefObject<HTMLElement | null>;
}

/**
 * The behaviour every modal owes its user: Escape closes it, Tab stays inside
 * it, the page behind doesn't scroll, and focus goes back where it came from.
 *
 * Leaves rendering and any dialog-specific keys (arrows, shortcuts) to the
 * caller — this only covers what's identical across all of them.
 */
export function useDialog({
    open,
    onClose,
    containerRef,
    initialFocusRef,
}: UseDialogOptions) {
    // Move focus in on open, hand it back on close.
    useEffect(() => {
        if (!open) return;
        const trigger = document.activeElement as HTMLElement | null;

        // rAF so the target exists after the enter animation mounts it.
        const raf = requestAnimationFrame(() => {
            const target =
                initialFocusRef?.current ??
                containerRef.current?.querySelector<HTMLElement>(FOCUSABLE);
            target?.focus();
        });

        return () => {
            cancelAnimationFrame(raf);
            trigger?.focus();
        };
    }, [open, containerRef, initialFocusRef]);

    // Scroll lock. The padding compensates for the removed scrollbar so the
    // page behind doesn't visibly jump sideways.
    useEffect(() => {
        if (!open) return;
        const { body, documentElement } = document;
        const gap = window.innerWidth - documentElement.clientWidth;
        const prevOverflow = body.style.overflow;
        const prevPadding = body.style.paddingRight;
        body.style.overflow = "hidden";
        if (gap > 0) body.style.paddingRight = `${gap}px`;
        return () => {
            body.style.overflow = prevOverflow;
            body.style.paddingRight = prevPadding;
        };
    }, [open]);

    // Escape to close, Tab cycling within the dialog.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                e.preventDefault();
                onClose();
                return;
            }
            if (e.key !== "Tab") return;

            const focusables =
                containerRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
            if (!focusables || focusables.length === 0) return;

            const first = focusables[0];
            const last = focusables[focusables.length - 1];

            if (e.shiftKey && document.activeElement === first) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault();
                first.focus();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onClose, containerRef]);
}
