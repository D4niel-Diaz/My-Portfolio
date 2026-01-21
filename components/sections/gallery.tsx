"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Images } from "lucide-react";
import Image from "next/image";
import { fadeInUp } from "@/lib/utils";

const galleryImages = [
    { id: 1, src: "/photos/d1.jpg", alt: "Photo 1" },
    { id: 2, src: "/photos/d2.jpg", alt: "Photo 2" },
    { id: 3, src: "/photos/d3.jpg", alt: "Photo 3" },
    { id: 4, src: "/photos/d4.jpg", alt: "Photo 4" },
    { id: 5, src: "/photos/d5.jpg", alt: "Photo 5" },
    { id: 6, src: "/photos/d6.jpg", alt: "Photo 6" },
    { id: 7, src: "/photos/d8.jpg", alt: "Photo 7" },
    { id: 8, src: "/photos/d.jpg", alt: "Photo 8" },
];

const IMAGES_PER_PAGE = 4;
const AUTO_SCROLL_INTERVAL = 5000; // 5 seconds

export function Gallery() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [currentPage, setCurrentPage] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    const totalPages = Math.ceil(galleryImages.length / IMAGES_PER_PAGE);
    const startIndex = currentPage * IMAGES_PER_PAGE;
    const visibleImages = galleryImages.slice(startIndex, startIndex + IMAGES_PER_PAGE);

    // Auto-scroll effect
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setCurrentPage((prev) => (prev + 1) % totalPages);
        }, AUTO_SCROLL_INTERVAL);

        return () => clearInterval(interval);
    }, [isPaused, totalPages]);

    const nextPage = () => {
        setCurrentPage((prev) => (prev + 1) % totalPages);
    };

    const prevPage = () => {
        setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
    };

    return (
        <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                    <Images size={18} className="text-neutral-500" />
                    Gallery
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevPage}
                        className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Previous page"
                    >
                        <ChevronLeft size={16} className="text-neutral-600 dark:text-neutral-400" />
                    </button>
                    <span className="text-sm text-neutral-500">
                        {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        onClick={nextPage}
                        className="p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        aria-label="Next page"
                    >
                        <ChevronRight size={16} className="text-neutral-600 dark:text-neutral-400" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {visibleImages.map((image, index) => (
                    <motion.div
                        key={image.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="aspect-video bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden hover:scale-105 transition-all duration-300 cursor-pointer group"
                    >
                        <Image
                            src={image.src}
                            alt={image.alt}
                            width={400}
                            height={225}
                            className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                        />
                    </motion.div>
                ))}
            </div>

            {/* Auto-scroll indicator */}
            <div className="flex justify-center mt-3 gap-1.5">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setCurrentPage(i)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentPage
                            ? "bg-neutral-900 dark:bg-white w-4"
                            : "bg-neutral-300 dark:bg-neutral-600"
                            }`}
                        aria-label={`Go to page ${i + 1}`}
                    />
                ))}
            </div>
        </motion.div>
    );
}
