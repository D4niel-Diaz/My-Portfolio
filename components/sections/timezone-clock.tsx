"use client";

import { useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, MapPin } from "lucide-react";
import { fadeInUp } from "@/lib/utils";

export function TimezoneClock() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });
    const [time, setTime] = useState<Date | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setTime(new Date());

        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (!mounted || !time) {
        return (
            <motion.div ref={ref} variants={fadeInUp} initial="hidden" animate="visible">
                <div className="flex items-center gap-2 mb-3">
                    <Clock size={18} className="text-neutral-500" />
                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Local Time
                    </h2>
                </div>
                <div className="h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </motion.div>
        );
    }

    const philippinesTime = time.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    });

    const philippinesDate = time.toLocaleString("en-US", {
        timeZone: "Asia/Manila",
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    return (
        <motion.div
            ref={ref}
            variants={fadeInUp}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <div className="flex items-center gap-2 mb-3">
                <Clock size={18} className="text-neutral-500" />
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Local Time
                </h2>
            </div>

            <div className="flex items-center justify-between">
                <div>
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white font-mono">
                        {philippinesTime}
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                        {philippinesDate}
                    </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400">
                    <MapPin size={12} />
                    <span>Philippines</span>
                </div>
            </div>
        </motion.div>
    );
}
