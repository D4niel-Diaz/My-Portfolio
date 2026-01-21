"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { User } from "lucide-react";
import { aboutContent } from "@/lib/data";
import { fadeInUp } from "@/lib/utils";

export function About() {
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
                <User size={18} className="text-neutral-500" />
                About
            </h2>
            <div className="space-y-3">
                {aboutContent.split("\n\n").map((paragraph, index) => (
                    <p
                        key={index}
                        className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed"
                    >
                        {paragraph}
                    </p>
                ))}
            </div>
        </motion.div>
    );
}
