"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";
import { fadeInUp } from "@/lib/utils";

export function Experience() {
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
                <Briefcase size={18} className="text-neutral-500" />
                Experience
            </h2>

            <div className="space-y-4">
                {experiences.map((exp, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                        className="pb-4 border-b border-neutral-100 dark:border-neutral-800 last:border-0 last:pb-0"
                    >
                        <h3 className="font-medium text-neutral-900 dark:text-white text-sm">
                            {exp.title}
                        </h3>
                        <p className="text-xs text-neutral-500 dark:text-neutral-500 mb-2">
                            {exp.client}
                        </p>
                        <ul className="space-y-1">
                            {exp.description.slice(0, 2).map((item, i) => (
                                <li
                                    key={i}
                                    className="text-xs text-neutral-600 dark:text-neutral-400 flex items-start gap-1.5"
                                >
                                    <span className="w-1 h-1 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
