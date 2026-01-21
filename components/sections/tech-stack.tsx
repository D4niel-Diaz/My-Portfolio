"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Code2, X } from "lucide-react";
import { techStack } from "@/lib/data";
import { fadeInUp } from "@/lib/utils";

const categoryLabels: Record<keyof typeof techStack, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database & Cloud",
    other: "Other Skills"
};

export function TechStack() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [isModalOpen, setIsModalOpen] = useState(false);

    const categories = Object.keys(techStack) as Array<keyof typeof techStack>;
    const visibleCategories = categories.slice(0, 2);

    useEffect(() => {
        if (isModalOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isModalOpen]);

    return (
        <>
            <motion.div
                ref={ref}
                variants={fadeInUp}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Code2 size={18} className="text-neutral-500" />
                        Tech Stack
                    </h2>
                    {categories.length > 2 && (
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors font-medium"
                        >
                            View All
                        </button>
                    )}
                </div>

                <div className="space-y-4">
                    {visibleCategories.map((category, categoryIndex) => (
                        <div key={category}>
                            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-500 mb-2">
                                {categoryLabels[category]}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {techStack[category].map((tech, index) => (
                                    <motion.span
                                        key={tech}
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                                        transition={{
                                            delay: categoryIndex * 0.05 + index * 0.02,
                                            duration: 0.2,
                                        }}
                                        className="px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors"
                                    >
                                        {tech}
                                    </motion.span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Modal Popup */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsModalOpen(false)}
                    >
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                        {/* Modal Content */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg max-h-[80vh] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-700 overflow-hidden flex flex-col"
                        >
                            {/* Header - Fixed */}
                            <div className="flex items-center justify-between p-6 pb-4 border-b border-neutral-200 dark:border-neutral-800">
                                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white flex items-center gap-2">
                                    <Code2 size={20} className="text-neutral-500" />
                                    Tech Stack
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <X size={20} className="text-neutral-500" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="overflow-y-auto p-6 pt-4">
                                <div className="space-y-5">
                                    {categories.map((category) => (
                                        <div key={category}>
                                            <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                                                {categoryLabels[category]}
                                            </h3>
                                            <div className="flex flex-wrap gap-2">
                                                {techStack[category].map((tech) => (
                                                    <span
                                                        key={tech}
                                                        className="px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-medium"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
