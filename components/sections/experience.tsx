"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";
import { fadeInUp, riseItem, staggerParent, respectMotion } from "@/lib/motion";
import { useReveal } from "@/lib/hooks/use-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function Experience() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();
    const item = respectMotion(riseItem, reduced);

    return (
        <motion.section
            ref={ref}
            aria-labelledby="experience-heading"
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            <SectionHeading id="experience-heading" icon={Briefcase} className="mb-4">
                Experience
            </SectionHeading>

            <motion.ol
                variants={staggerParent(0.08)}
                initial="hidden"
                animate={animate}
                className="space-y-4"
            >
                {experiences.map((exp) => (
                    <motion.li
                        key={exp.title}
                        variants={item}
                        className="pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0"
                    >
                        {/* text-balance keeps two-line titles from leaving one
                            orphaned word on the second line. */}
                        <h3 className="font-medium text-neutral-900 dark:text-white text-sm text-balance">
                            {exp.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2">
                            {exp.client}
                        </p>
                        <ul className="space-y-1">
                            {exp.description.map((line, i) => (
                                <li
                                    key={i}
                                    className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5"
                                >
                                    <span
                                        className="w-1 h-1 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span className="min-w-0">{line}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.li>
                ))}
            </motion.ol>
        </motion.section>
    );
}
