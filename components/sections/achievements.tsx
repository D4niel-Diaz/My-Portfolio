"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { achievements } from "@/lib/data";
import { fadeInUp } from "@/lib/utils";
import { Award, Trophy } from "lucide-react";

export function Achievements() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-3 flex items-center gap-2">
                <Trophy size={18} className="text-neutral-500" />
                Achievements
            </h2>

            <div className="space-y-3">
                {achievements.map((achievement, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={isInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-start gap-3"
                    >
                        <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center flex-shrink-0">
                            <Award className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                            {achievement}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
