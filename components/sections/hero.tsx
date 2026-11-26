"use client";

import type { CSSProperties } from "react";
import { ArrowDown, MapPin, Send } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { TextType } from "@/components/ui/text-type";
import { personalInfo, heroRoles, techStack } from "@/lib/data";

const capabilities = [
    { label: "Frontend", items: techStack.frontend.slice(2, 5) },
    { label: "Backend", items: techStack.backend },
];
const enterStyle = (index: number) => ({ "--enter-index": index }) as CSSProperties;

export function Hero() {
    return (
        <section className="hero-section" id="home" aria-labelledby="hero-title">
            <div className="hero-layout">
                <div className="hero-copy" data-enter style={enterStyle(0)}>
                    <div className="hero-eyebrow">
                        <span>About</span><span aria-hidden="true" />
                        <span>{personalInfo.tagline}</span>
                    </div>
                    <h1 id="hero-title" className="hero-title" data-enter style={enterStyle(1)}>
                        {personalInfo.name}<VerifiedBadge className="hero-verified" />
                    </h1>
                    <div className="hero-rule" aria-hidden="true" />
                    <div className="hero-description" data-enter style={enterStyle(2)}>
                        <p className="hero-role">
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
                        </p>
                        <p className="hero-intro">
                            I build responsive web applications with Laravel, React, and MySQL, from API and database design to polished interfaces.
                        </p>
                        <p className="hero-location"><MapPin size={14} aria-hidden="true" />{personalInfo.location}</p>
                    </div>
                </div>

                <figure className="hero-portrait-wrap" data-enter style={enterStyle(3)}>
                    <div className="hero-portrait-frame">
                        <span className="portrait-figure-label">Fig. 01</span>
                        <div className="hero-portrait">
                            <Image
                                src="/Avatar1.png"
                                alt={`${personalInfo.name}, ${personalInfo.role}`}
                                width={1024}
                                height={1024}
                                sizes="(max-width: 620px) 90vw, 600px"
                                quality={95}
                                className="hero-portrait-image"
                                priority
                            />
                        </div>
                        <figcaption><span>{personalInfo.name}</span><span aria-hidden="true" /></figcaption>
                    </div>
                </figure>

                <div className="hero-capabilities" data-enter style={enterStyle(4)}>
                    <div className="capabilities-heading"><span>Capabilities</span><span aria-hidden="true" /></div>
                    <ul>
                        {capabilities.map((capability) => (
                            <li key={capability.label}>
                                <h2>{capability.label}</h2>
                                <p>{capability.items.join(" · ")}</p>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="hero-actions" data-enter style={enterStyle(5)}>
                    <a className="hero-work-link" href="#projects">See my work <ArrowDown size={17} aria-hidden="true" /></a>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => (window.location.href = `mailto:${personalInfo.email}`)}
                        aria-label={`Send an email to ${personalInfo.email}`}
                    >
                        <Send size={14} aria-hidden="true" /> Send email
                    </Button>
                </div>
            </div>
        </section>
    );
}
