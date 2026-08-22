"use client";

import { useEffect, useId, useState } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { fadeInUp } from "@/lib/motion";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMounted } from "@/lib/hooks/use-mounted";
import { usePageVisible } from "@/lib/hooks/use-page-visible";
import { useReveal } from "@/lib/hooks/use-reveal";

const TIME_ZONE = "Asia/Manila";

const timeFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
});

const dateFormat = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE,
    weekday: "long",
    month: "short",
    day: "numeric",
});

export function TimezoneClock() {
    const { ref, animate } = useReveal();
    // The page renders this card twice — mobile and desktop — and hides one, so
    // the heading id has to be unique per instance rather than hard-coded.
    const headingId = useId();
    const mounted = useMounted();
    const pageVisible = usePageVisible();
    const [time, setTime] = useState<Date>(() => new Date());

    // The clock only ticks while the tab is in the foreground. Coming back
    // resyncs on the next frame rather than waiting out a full second on a
    // time that's already stale.
    useEffect(() => {
        if (!pageVisible) return;
        const tick = () => setTime(new Date());
        const raf = requestAnimationFrame(tick);
        const interval = setInterval(tick, 1000);
        return () => {
            cancelAnimationFrame(raf);
            clearInterval(interval);
        };
    }, [pageVisible]);

    const header = (
        <SectionHeading id={headingId} icon={Clock} className="mb-3">
            Local Time
        </SectionHeading>
    );

    // The server can't know the visitor's clock, so render a skeleton until
    // the first client tick — otherwise the markup mismatches on hydration.
    if (!mounted) {
        return (
            <motion.section
                ref={ref}
                aria-labelledby={headingId}
                variants={fadeInUp}
                initial="hidden"
                animate="visible"
            >
                {header}
                <div className="h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </motion.section>
        );
    }

    return (
        <motion.section
            ref={ref}
            aria-labelledby={headingId}
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            {header}

            <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                    {/* tabular-nums keeps the digits from jittering each second. */}
                    <p className="text-2xl font-semibold text-neutral-900 dark:text-white font-mono tabular-nums">
                        <time dateTime={time.toISOString()}>{timeFormat.format(time)}</time>
                    </p>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5 truncate">
                        {dateFormat.format(time)}
                    </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-neutral-400 flex-shrink-0">
                    <MapPin size={12} />
                    <span>Philippines</span>
                </div>
            </div>
        </motion.section>
    );
}
