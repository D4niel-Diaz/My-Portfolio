"use client";

import { motion } from "framer-motion";
import { MapPin, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { TextType } from "@/components/ui/text-type";
import { personalInfo, heroRoles } from "@/lib/data";
import { fadeInUp, staggerContainer } from "@/lib/motion";

export function Hero() {
    return (
        <section className="hero-section" id="home">
            <motion.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="hero-layout"
            >
                <motion.div
                    variants={fadeInUp}
                    className="hero-portrait-wrap"
                >
                    <div className="hero-portrait">
                        <Image
                            src="/final-avatar-cutout.png"
                            alt={`${personalInfo.name}, ${personalInfo.role}`}
                            width={1254}
                            height={1254}
                            sizes="(max-width: 620px) 128px, (max-width: 800px) 290px, 360px"
                            className="hero-portrait-image"
                            priority
                        />
                    </div>
                </motion.div>

                {/* Content - Always on right */}
                <div className="hero-copy">
                    {/* Name row with theme toggle */}
                    <div className="hero-title-row">
                        <motion.h1
                            variants={fadeInUp}
                            className="hero-title"
                        >
                            <span>{personalInfo.name}</span>
                            <VerifiedBadge className="w-5 h-5 flex-shrink-0" />
                        </motion.h1>

                        <ThemeToggle />
                    </div>

                    <motion.div
                        variants={fadeInUp}
                        className="hero-location"
                    >
                        <MapPin size={12} className="sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                        <span className="truncate">{personalInfo.location}</span>
                    </motion.div>

                    <motion.p
                        variants={fadeInUp}
                        className="hero-role"
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

                    <motion.p variants={fadeInUp} className="hero-intro">
                        I build responsive web applications with Laravel, React, and MySQL, from API and database design to polished interfaces.
                    </motion.p>

                    <motion.div
                        variants={fadeInUp}
                        className="hero-actions"
                    >
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
