"use client";

import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { MapPin, Download, Send } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { TextType } from "@/components/ui/text-type";
import { personalInfo, heroRoles } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";
import { useMounted } from "@/lib/hooks/use-mounted";

const AVATAR = {
    light: "/Avatar1.png",
    dark: "/avatar2.jpg",
} as const;

export function Hero() {
    const { resolvedTheme } = useTheme();
    const mounted = useMounted();
    const reduced = useReducedMotion();

    const currentAvatar =
        resolvedTheme === "dark" ? AVATAR.dark : AVATAR.light;

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
                >
                    <div className="w-28 h-28 sm:w-40 sm:h-40 rounded-2xl overflow-hidden shadow-lg border-2 border-neutral-200 dark:border-neutral-700 relative">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={mounted ? currentAvatar : "placeholder"}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: reduced ? 0 : 0.25 }}
                                className="w-full h-full"
                            >
                                {mounted ? (
                                    <Image
                                        src={currentAvatar}
                                        alt={`${personalInfo.name}, ${personalInfo.role}`}
                                        width={160}
                                        height={160}
                                        sizes="(max-width: 640px) 112px, 160px"
                                        className="w-full h-full object-cover"
                                        priority
                                    />
                                ) : (
                                    // Placeholder until next-themes resolves, so the
                                    // wrong avatar never flashes on first paint.
                                    <div className="w-full h-full bg-neutral-200 dark:bg-neutral-800 animate-pulse" />
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
                            className="text-lg sm:text-3xl font-bold text-neutral-900 dark:text-white flex items-center gap-1.5 sm:gap-2 min-w-0"
                        >
                            <span className="truncate">{personalInfo.name}</span>
                            <VerifiedBadge className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        </motion.h1>

                        <ThemeToggle />
                    </div>

                    <motion.div
                        variants={fadeInUp}
                        className="flex items-center gap-1 text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm mt-0.5 sm:mt-1"
                    >
                        <MapPin size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="truncate">{personalInfo.location}</span>
                    </motion.div>

                    <motion.p
                        variants={fadeInUp}
                        className="text-neutral-700 dark:text-neutral-300 font-medium text-xs sm:text-base mt-0.5 sm:mt-1"
                    >
                        {/* The animated line reads as noise to a screen reader
                            mid-keystroke, so expose the plain role instead. */}
                        <span className="sr-only">{personalInfo.role}</span>
                        <TextType
                            as="span"
                            aria-hidden="true"
                            text={heroRoles}
                            typingSpeed={70}
                            deletingSpeed={35}
                            pauseDuration={2000}
                            initialDelay={400}
                            variableSpeed={{ min: 50, max: 110 }}
                            cursorClassName="text-neutral-400 dark:text-neutral-500 font-normal"
                        />
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="flex flex-row flex-wrap gap-2 sm:gap-3 mt-2 sm:mt-4"
                    >
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => window.open("/Daniel_Diaz_Resume.pdf", "_blank", "noopener,noreferrer")}
                            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                            aria-label="Download resume (PDF, opens in a new tab)"
                        >
                            <Download size={12} className="sm:w-3.5 sm:h-3.5" />
                            <span className="hidden sm:inline">Download </span>Resume
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => (window.location.href = `mailto:${personalInfo.email}`)}
                            className="gap-1.5 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4 py-1.5 sm:py-2"
                            aria-label={`Send an email to ${personalInfo.email}`}
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
