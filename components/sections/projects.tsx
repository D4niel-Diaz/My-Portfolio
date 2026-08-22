"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FolderOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/data";
import { fadeInUp, popItem, staggerParent, respectMotion } from "@/lib/motion";
import { useReveal } from "@/lib/hooks/use-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const VISIBLE_TAGS = 2;

export function Projects() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();
    const item = respectMotion(popItem, reduced);

    return (
        <motion.section
            ref={ref}
            aria-labelledby="projects-heading"
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            <SectionHeading id="projects-heading" icon={FolderOpen} className="mb-4">
                Projects
            </SectionHeading>

            <motion.div
                variants={staggerParent(0.08)}
                initial="hidden"
                animate={animate}
                className="grid grid-cols-2 md:grid-cols-4 gap-3"
            >
                {projects.map((project) => {
                    const hasUrl = project.url.length > 0;
                    const CardWrapper = hasUrl ? motion.a : motion.div;
                    const cardProps = hasUrl
                        ? {
                            href: project.url,
                            target: "_blank",
                            rel: "noopener noreferrer",
                            // Screen readers get the full title plus the "opens
                            // in a new tab" warning the visual arrow implies.
                            "aria-label": `${project.title} — ${project.description} (opens in a new tab)`,
                        }
                        : {};

                    const hiddenTags = project.tags.length - VISIBLE_TAGS;

                    return (
                        <CardWrapper
                            key={project.title}
                            {...cardProps}
                            variants={item}
                            // Titles are truncated to one line; the tooltip keeps
                            // the full name and summary reachable on hover.
                            title={`${project.title} — ${project.description}`}
                            className={`group block bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden transition-all duration-300 ${hasUrl
                                ? "hover:scale-105 motion-reduce:hover:scale-100 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
                                : ""
                                }`}
                        >
                            {/* Project Image */}
                            <div className="aspect-video bg-neutral-200 dark:bg-neutral-700 relative overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={`${project.title} screenshot`}
                                    width={400}
                                    height={225}
                                    className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-300"
                                />
                                {hasUrl && (
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 group-focus-visible:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                        <ExternalLink
                                            size={20}
                                            className="text-white opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-300"
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
                                    {project.tags.slice(0, VISIBLE_TAGS).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                    {hiddenTags > 0 && (
                                        <span
                                            className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400"
                                            title={project.tags.slice(VISIBLE_TAGS).join(", ")}
                                        >
                                            +{hiddenTags}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </CardWrapper>
                    );
                })}
            </motion.div>
        </motion.section>
    );
}
