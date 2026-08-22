"use client";

import { motion, useReducedMotion } from "framer-motion";
import { achievements } from "@/lib/data";
import { Award, Trophy } from "lucide-react";
import { fadeInUp, staggerParent, respectMotion, DURATION, EASE_OUT_QUINT } from "@/lib/motion";
import { useReveal } from "@/lib/hooks/use-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const slideItem = {
    hidden: { opacity: 0, x: -12 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: DURATION.slow, ease: EASE_OUT_QUINT },
    },
};

export function Achievements() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();
    const item = respectMotion(slideItem, reduced);

    return (
        <motion.section
            ref={ref}
            aria-labelledby="achievements-heading"
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            <SectionHeading id="achievements-heading" icon={Trophy} className="mb-3">
                Achievements
            </SectionHeading>

            <motion.ul
                variants={staggerParent(0.08)}
                initial="hidden"
                animate={animate}
                className="space-y-3"
            >
                {achievements.map((achievement) => (
                    <motion.li
                        key={achievement}
                        variants={item}
                        className="flex items-start gap-3"
                    >
                        <div
                            className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0"
                            aria-hidden="true"
                        >
                            <Award className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 min-w-0">
                            {achievement}
                        </p>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.section>
    );
}
