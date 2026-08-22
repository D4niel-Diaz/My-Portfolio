"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Images, Expand } from "lucide-react";
import Image from "next/image";
import { galleryPhotos } from "@/lib/data";
import { fadeInUp, EASE_OUT_EXPO, DURATION } from "@/lib/motion";
import { Lightbox } from "@/components/ui/lightbox";
import { SectionHeading } from "@/components/ui/section-heading";
import { usePageVisible } from "@/lib/hooks/use-page-visible";
import { useReveal } from "@/lib/hooks/use-reveal";

const IMAGES_PER_PAGE = 4;
const AUTO_SCROLL_INTERVAL = 5000;
/** Horizontal distance, in px, that counts as a swipe rather than a tap. */
const SWIPE_THRESHOLD = 60;

export function Gallery() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();
    const pageVisible = usePageVisible();

    const [[currentPage, direction], setPage] = useState<[number, number]>([0, 0]);
    const [isHovered, setIsHovered] = useState(false);
    const [hasFocus, setHasFocus] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

    // Set while a drag is in flight so the pointerup doesn't also open a photo.
    const draggingRef = useRef(false);

    const totalPages = Math.ceil(galleryPhotos.length / IMAGES_PER_PAGE);
    const startIndex = currentPage * IMAGES_PER_PAGE;
    const visibleImages = galleryPhotos.slice(startIndex, startIndex + IMAGES_PER_PAGE);

    const goToPage = useCallback((next: number, dir: number) => {
        setPage([(next + totalPages) % totalPages, dir]);
    }, [totalPages]);

    const nextPage = useCallback(() => goToPage(currentPage + 1, 1), [currentPage, goToPage]);
    const prevPage = useCallback(() => goToPage(currentPage - 1, -1), [currentPage, goToPage]);

    // Auto-advance. Held while the visitor is reading (hover/focus), while the
    // lightbox is up, on a backgrounded tab, and for reduced-motion users.
    const paused =
        isHovered || hasFocus || lightboxIndex !== null || !pageVisible || !!reduced;

    useEffect(() => {
        if (paused || totalPages < 2) return;
        const interval = setInterval(() => {
            setPage(([page]) => [(page + 1) % totalPages, 1]);
        }, AUTO_SCROLL_INTERVAL);
        return () => clearInterval(interval);
        // currentPage restarts the countdown after a manual jump, so a page you
        // just navigated to gets the full interval rather than the remainder.
    }, [paused, totalPages, currentPage]);

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowLeft") {
            e.preventDefault();
            prevPage();
        } else if (e.key === "ArrowRight") {
            e.preventDefault();
            nextPage();
        }
    };

    // Pages slide in from the side you're travelling towards.
    const slide = {
        enter: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * 40 }),
        center: { opacity: 1, x: 0 },
        exit: (dir: number) => ({ opacity: 0, x: reduced ? 0 : dir * -40 }),
    };

    return (
        <>
            <motion.section
                ref={ref}
                aria-labelledby="gallery-heading"
                variants={fadeInUp}
                initial="hidden"
                animate={animate}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onFocusCapture={() => setHasFocus(true)}
                onBlurCapture={() => setHasFocus(false)}
            >
                <div className="flex items-center justify-between mb-4">
                    <SectionHeading id="gallery-heading" icon={Images}>
                        Gallery
                    </SectionHeading>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={prevPage}
                            className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                            aria-label="Previous page of photos"
                        >
                            <ChevronLeft size={16} className="text-neutral-600 dark:text-neutral-400" />
                        </button>
                        <span className="text-sm text-neutral-500 tabular-nums" aria-hidden="true">
                            {currentPage + 1} / {totalPages}
                        </span>
                        <button
                            onClick={nextPage}
                            className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                            aria-label="Next page of photos"
                        >
                            <ChevronRight size={16} className="text-neutral-600 dark:text-neutral-400" />
                        </button>
                    </div>
                </div>

                {/* Arrow keys page through once anything in here has focus. */}
                <div
                    className="overflow-hidden"
                    role="group"
                    aria-roledescription="carousel"
                    aria-label="Photo gallery"
                    onKeyDown={onKeyDown}
                >
                    <AnimatePresence mode="wait" initial={false} custom={direction}>
                        <motion.div
                            key={currentPage}
                            custom={direction}
                            variants={slide}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: DURATION.base, ease: EASE_OUT_EXPO }}
                            drag={totalPages > 1 && !reduced ? "x" : false}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.12}
                            onDragStart={() => {
                                draggingRef.current = true;
                            }}
                            onDragEnd={(_, info) => {
                                if (info.offset.x < -SWIPE_THRESHOLD) nextPage();
                                else if (info.offset.x > SWIPE_THRESHOLD) prevPage();
                                // Cleared next tick so the synthetic click that
                                // follows the drag is ignored.
                                setTimeout(() => (draggingRef.current = false), 0);
                            }}
                            className="grid grid-cols-2 md:grid-cols-4 gap-3 touch-pan-y"
                        >
                            {visibleImages.map((image, index) => {
                                const globalIndex = startIndex + index;
                                return (
                                    <motion.button
                                        key={image.id}
                                        type="button"
                                        initial={reduced ? false : { opacity: 0, scale: 0.94 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            delay: reduced ? 0 : index * 0.06,
                                            duration: DURATION.base,
                                            ease: EASE_OUT_EXPO,
                                        }}
                                        onClick={() => {
                                            if (draggingRef.current) return;
                                            setLightboxIndex(globalIndex);
                                        }}
                                        aria-label={`Open photo ${globalIndex + 1}: ${image.alt}`}
                                        className="group relative aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 motion-reduce:hover:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
                                    >
                                        <Image
                                            src={image.src}
                                            alt=""
                                            fill
                                            sizes="(max-width: 768px) 45vw, 22vw"
                                            className="object-cover transition-all duration-300 group-hover:brightness-110"
                                            draggable={false}
                                        />
                                        {/* Hover affordance — the tile does something when clicked. */}
                                        <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/30 group-hover:opacity-100 group-focus-visible:bg-black/30 group-focus-visible:opacity-100">
                                            <Expand size={18} className="text-white" />
                                        </span>
                                    </motion.button>
                                );
                            })}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Page dots */}
                <div className="flex justify-center mt-3 gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => goToPage(i, i > currentPage ? 1 : -1)}
                            aria-label={`Go to page ${i + 1} of ${totalPages}`}
                            aria-current={i === currentPage ? "true" : undefined}
                            className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900 ${i === currentPage
                                ? "w-4 bg-neutral-900 dark:bg-white"
                                : "w-2 bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500"
                                }`}
                        />
                    ))}
                </div>

                {/* Announced to screen readers as the page changes. */}
                <p className="sr-only" aria-live="polite">
                    Page {currentPage + 1} of {totalPages}
                </p>
            </motion.section>

            <Lightbox
                images={galleryPhotos}
                index={lightboxIndex}
                onClose={() => setLightboxIndex(null)}
                onNavigate={setLightboxIndex}
            />
        </>
    );
}
