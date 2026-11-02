"use client";

import { useEffect, useRef, useState } from "react";
import { Github, Mail, Link2, Instagram, Facebook, Copy, Check, ArrowUpRight } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

const socialLinks = [
    { name: "GitHub", href: personalInfo.github, icon: Github, external: true, detail: "Code and projects" },
    { name: "Instagram", href: personalInfo.instagram, icon: Instagram, external: true, detail: "Instagram profile" },
    { name: "Facebook", href: personalInfo.facebook, icon: Facebook, external: true, detail: "Facebook profile" },
    { name: "Email", href: `mailto:${personalInfo.email}`, icon: Mail, external: false, detail: personalInfo.email },
];

export function SocialLinks() {
    const [copied, setCopied] = useState(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (timer.current) clearTimeout(timer.current);
    }, []);

    const copyEmail = async () => {
        try {
            await navigator.clipboard.writeText(personalInfo.email);
            setCopied(true);
            if (timer.current) clearTimeout(timer.current);
            timer.current = setTimeout(() => setCopied(false), 2000);
        } catch {
            window.location.href = `mailto:${personalInfo.email}`;
        }
    };

    return (
        <section aria-labelledby="social-links-heading" data-reveal>
            <SectionHeading id="social-links-heading" icon={Link2} className="mb-4">Contact</SectionHeading>
            <p className="contact-intro">For work and collaborations, reach me through any of these channels.</p>
            <ul className="social-grid">
                {socialLinks.map((link) => (
                    <li key={link.name} data-reveal>
                        <div className="social-contact-card">
                            <a
                                href={link.href}
                                target={link.external ? "_blank" : undefined}
                                rel={link.external ? "noopener noreferrer" : undefined}
                                aria-label={link.external ? `${link.name} (opens in a new tab)` : `Email ${personalInfo.email}`}
                                className="social-contact-link"
                            >
                                <span className="social-contact-icon"><link.icon size={19} aria-hidden="true" /></span>
                                <span className="social-contact-copy">
                                    <strong>{link.name}</strong>
                                    <small>{link.detail}</small>
                                </span>
                                <ArrowUpRight size={17} aria-hidden="true" className="social-contact-arrow" />
                            </a>
                            {!link.external && (
                                <button type="button" onClick={copyEmail} className="copy-email" aria-label={copied ? "Email address copied" : "Copy email address"}>
                                    {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
                                    <span className="sr-only">{copied ? "Copied!" : "Copy email"}</span>
                                </button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
            <p className="copy-feedback" aria-live="polite">{copied ? "Email copied to clipboard." : ""}</p>
        </section>
    );
}
