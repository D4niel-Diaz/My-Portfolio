"use client";

import { useEffect, useId, useState } from "react";
import { Clock, MapPin } from "lucide-react";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMounted } from "@/lib/hooks/use-mounted";
import { usePageVisible } from "@/lib/hooks/use-page-visible";

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
            <section aria-labelledby={headingId} data-reveal>
                {header}
                <div className="h-12 rounded-lg bg-neutral-100 dark:bg-neutral-800 animate-pulse" />
            </section>
        );
    }

    return (
        <section aria-labelledby={headingId} data-reveal>
            {header}

            <div className="timezone-clock-readout">
                {/* tabular-nums keeps the digits from jittering each second. */}
                <p className="timezone-clock-time">
                    <time dateTime={time.toISOString()}>{timeFormat.format(time)}</time>
                </p>
                <p className="timezone-clock-date">{dateFormat.format(time)}</p>
                <p className="timezone-clock-zone">
                    <MapPin size={11} aria-hidden="true" />
                    <span>Philippines</span>
                </p>
            </div>
        </section>
    );
}
