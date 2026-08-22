"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useMounted } from "@/lib/hooks/use-mounted";
import { useDialog } from "@/lib/hooks/use-dialog";
import { EASE_OUT_QUINT, DURATION } from "@/lib/motion";

export interface LightboxImage {
    id: number | string;
    src: string;
    alt: string;
    caption?: string;
}

interface LightboxProps {
    images: LightboxImage[];
    /** null = closed. */
    index: number | null;
    onClose: () => void;
    onNavigate: (nextIndex: number) => void;
}

/**
 * Accessible image lightbox.
 *
 * Rendered through a portal on <body> so the overlay is positioned against the
 * viewport — a `position: fixed` element nested under a transformed ancestor
 * (which every animated section here is) would anchor to that ancestor instead.
 *
 * Keyboard: Escape closes, ArrowLeft/ArrowRight navigate, Tab is trapped inside
 * the dialog, and focus returns to the trigger on close. Dragging the image
 * sideways navigates on touch.
 */
export function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
    const mounted = useMounted();
    const reduced = useReducedMotion();
    const open = index !== null;

    const dialogRef = useRef<HTMLDivElement>(null);
    const closeRef = useRef<HTMLButtonElement>(null);

    const goPrev = useCallback(() => {
        if (index === null) return;
        onNavigate((index - 1 + images.length) % images.length);
    }, [index, images.length, onNavigate]);

    const goNext = useCallback(() => {
        if (index === null) return;
        onNavigate((index + 1) % images.length);
    }, [index, images.length, onNavigate]);

    // Escape, Tab trap, scroll lock, focus restore.
    useDialog({ open, onClose, containerRef: dialogRef, initialFocusRef: closeRef });

    // Arrow keys are this dialog's own addition on top of that.
    useEffect(() => {
        if (!open) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") {
                e.preventDefault();
                goPrev();
            } else if (e.key === "ArrowRight") {
                e.preventDefault();
                goNext();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, goPrev, goNext]);

    if (!mounted) return null;

    const current = index !== null ? images[index] : null;
    const controlClass =
        "inline-flex items-center justify-center rounded-full bg-white/90 dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-white dark:hover:bg-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40";

    return createPortal(
        <AnimatePresence>
            {open && current && (
                <motion.div
                    initial={reduced ? { opacity: 1 } : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: DURATION.fast }}
                    className="fixed inset-0 z-100 flex flex-col"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        onClick={onClose}
                        aria-hidden="true"
                    />

                    <div
                        ref={dialogRef}
                        role="dialog"
                        aria-modal="true"
                        aria-label={`Photo ${index + 1} of ${images.length}`}
                        className="relative flex h-full flex-col"
                    >
                        {/* Top bar */}
                        <div className="flex items-center justify-between px-4 py-4 sm:px-6">
                            <span className="text-sm font-medium text-white/80 tabular-nums">
                                {index + 1} / {images.length}
                            </span>
                            <button
                                ref={closeRef}
                                type="button"
                                onClick={onClose}
                                className={`${controlClass} h-10 w-10`}
                                aria-label="Close gallery"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Stage */}
                        <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 pb-2 sm:px-6">
                            <AnimatePresence mode="wait" initial={false}>
                                <motion.figure
                                    key={current.id}
                                    initial={reduced ? false : { opacity: 0, scale: 0.97 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={reduced ? undefined : { opacity: 0, scale: 0.99 }}
                                    transition={{ duration: DURATION.base, ease: EASE_OUT_QUINT }}
                                    drag={images.length > 1 ? "x" : false}
                                    dragConstraints={{ left: 0, right: 0 }}
                                    dragElastic={0.15}
                                    onDragEnd={(_, info) => {
                                        if (info.offset.x < -60) goNext();
                                        else if (info.offset.x > 60) goPrev();
                                    }}
                                    className="relative flex h-full w-full max-w-4xl cursor-grab flex-col items-center justify-center gap-4 active:cursor-grabbing"
                                >
                                    <div className="relative min-h-0 w-full flex-1">
                                        <Image
                                            src={current.src}
                                            alt={current.alt}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 80vw"
                                            className="pointer-events-none object-contain select-none"
                                            priority
                                        />
                                    </div>
                                    {current.caption && (
                                        <figcaption className="max-w-2xl text-center text-sm text-white/70">
                                            {current.caption}
                                        </figcaption>
                                    )}
                                </motion.figure>
                            </AnimatePresence>
                        </div>

                        {/* Controls — after the image in DOM order so Tab reaches close first */}
                        <div className="flex items-center justify-center gap-3 px-4 pb-8 pt-2">
                            <button
                                type="button"
                                onClick={goPrev}
                                className={`${controlClass} h-11 w-11`}
                                aria-label="Previous photo"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                type="button"
                                onClick={goNext}
                                className={`${controlClass} h-11 w-11`}
                                aria-label="Next photo"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
