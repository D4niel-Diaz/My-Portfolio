"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FolderOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/data";
import { fadeInUp } from "@/lib/utils";

export function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                <FolderOpen size={18} className="text-neutral-500" />
                Projects
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {projects.map((project, index) => {
                    const hasUrl = project.url && project.url.length > 0;
                    const CardWrapper = hasUrl ? motion.a : motion.div;
                    const cardProps = hasUrl
                        ? {
                            href: project.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                        }
                        : {};

                    return (
                        <CardWrapper
                            key={project.title}
                            {...cardProps}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ delay: index * 0.1 }}
                            className={`group block bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ${hasUrl
                                ? "hover:scale-105 cursor-pointer"
                                : ""
                                }`}
                        >
                            {/* Project Image */}
                            <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 relative overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    width={400}
                                    height={225}
                                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                                />
                                {hasUrl && (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                        <ExternalLink
                                            size={20}
                                            className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Project Info */}
                            <div className="p-2">
                                <h3
                                    className={`font-medium text-neutral-900 dark:text-white text-xs mb-0.5 truncate transition-colors ${hasUrl
                                        ? "group-hover:text-blue-600 dark:group-hover:text-blue-400"
                                        : ""
                                        }`}
                                >
                                    {project.title}
                                </h3>
                                <div className="flex flex-wrap gap-1">
                                    {project.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </CardWrapper>
                    );
                })}
            </div>
        </motion.div>
    );
}

