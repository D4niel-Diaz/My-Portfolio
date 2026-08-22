"use client";

import { motion, useReducedMotion } from "framer-motion";
import { User } from "lucide-react";
import { aboutContent } from "@/lib/data";
import { fadeInUp, riseItem, staggerParent, respectMotion } from "@/lib/motion";
import { useReveal } from "@/lib/hooks/use-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();
    const item = respectMotion(riseItem, reduced);

    const paragraphs = aboutContent.split("\n\n");

    return (
        <motion.section
            ref={ref}
            aria-labelledby="about-heading"
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            <SectionHeading id="about-heading" icon={User} className="mb-3">
                About
            </SectionHeading>
            <motion.div
                variants={staggerParent(0.1)}
                initial="hidden"
                animate={animate}
                className="space-y-3"
            >
                {paragraphs.map((paragraph, index) => (
                    <motion.p
                        key={index}
                        variants={item}
                        // text-pretty stops the last line of a paragraph ending
                        // on a single orphaned word.
                        className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-pretty"
                    >
                        {paragraph}
                    </motion.p>
                ))}
            </motion.div>
        </motion.section>
    );
}
