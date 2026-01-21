"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Download, Send } from "lucide-react";
import { useTheme } from "next-themes";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { personalInfo } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/utils";

export function Hero() {
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [isToggled, setIsToggled] = useState(false);
    const [isTouchDevice, setIsTouchDevice] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setMounted(true);
        // Detect touch device instead of screen width
        const checkTouch = () => {
            setIsTouchDevice(
                'ontouchstart' in window ||
                navigator.maxTouchPoints > 0
            );
        };
        checkTouch();
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    const isDark = resolvedTheme === "dark";

    let currentAvatar: string;
    if (isDark) {
        currentAvatar = isToggled ? "/avatar2.jpg" : "/avatar2.jpg";
    } else {
        currentAvatar = "/Avatar1.png";
    }

    const handleMouseEnter = () => {
        if (!isTouchDevice && isDark) setIsToggled(true);
    };

    const handleMouseLeave = () => {
        if (!isTouchDevice && isDark) setIsToggled(false);
    };

    const handleClick = () => {
        if (isTouchDevice && isDark) {
            setIsToggled(true);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                setIsToggled(false);
            }, 3000);
        }
    };

    return (
        <section className="mb-8">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="flex flex-row items-start gap-4 sm:gap-6"
            >

                <motion.div
                    variants={fadeInUp}
                    className="flex-shrink-0"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={handleClick}
                >
                    <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-neutral-200 dark:border-neutral-700 relative cursor-pointer">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mounted ? currentAvatar : "placeholder"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.15 }}
                                className="w-full h-full"
                            >
                                {mounted ? (
                                    <Image
                                        src={currentAvatar}
                                        alt={personalInfo.name}
                                        width={160}
                                        height={160}
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                                        <span className="text-3xl sm:text-4xl font-bold text-neutral-400">AS</span>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>

                {/* Content - Always on right */}
                <div className="flex-grow min-w-0">
                    {/* Name row with theme toggle */}
                    <div className="flex items-center justify-between gap-2">
                        <motion.h1
                            variants={fadeInUp}
                            className="text-lg sm:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 sm:gap-2"
                        >
                            {personalInfo.name}
                            <VerifiedBadge className="w-4 h-4 sm:w-5 sm:h-5" />
                        </motion.h1>

                        <ThemeToggle />
                    </div>

                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-0.5 sm:mt-1"
                    >
                        <MapPin size={12} className="sm:w-3.5 sm:h-3.5" />
                        <span>{personalInfo.location}</span>
                    </motion.div>

                    <motion.p
                        variants={fadeInUp}
                        className="text-neutral-700 dark:text-neutral-300 font-medium text-xs sm:text-base mt-0.5 sm:mt-1"
                    >
                        {personalInfo.role}
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-row gap-2 sm:gap-3 mt-2 sm:mt-4"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => window.open("/resume1.pdf", "_blank")}
                            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                        >
                            <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Download </span>Resume
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => (window.location.href = `mailto:${personalInfo.email}`)}
                            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                        >
                            <Send size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Send </span>Email
                        </Button>
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}