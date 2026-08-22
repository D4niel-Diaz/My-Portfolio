"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Github, Mail, Link2, Instagram, Facebook } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { fadeInUp, riseItem, staggerParent, respectMotion } from "@/lib/motion";
import { useReveal } from "@/lib/hooks/use-reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const socialLinks = [
    { name: "GitHub", href: personalInfo.github, icon: Github, external: true },
    { name: "Instagram", href: personalInfo.instagram, icon: Instagram, external: true },
    { name: "Facebook", href: personalInfo.facebook, icon: Facebook, external: true },
    { name: "Email", href: `mailto:${personalInfo.email}`, icon: Mail, external: false },
];

export function SocialLinks() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();
    const item = respectMotion(riseItem, reduced);

    return (
        <motion.section
            ref={ref}
            aria-labelledby="social-links-heading"
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            <SectionHeading id="social-links-heading" icon={Link2} className="mb-3">
                Social Links
            </SectionHeading>

            <motion.ul
                variants={staggerParent(0.06)}
                initial="hidden"
                animate={animate}
                className="space-y-2"
            >
                {socialLinks.map((link) => (
                    <motion.li key={link.name} variants={item}>
                        <a
                            href={link.href}
                            target={link.external ? "_blank" : undefined}
                            rel={link.external ? "noopener noreferrer" : undefined}
                            // Screen readers get the new-tab warning that sighted
                            // users infer from the icon.
                            aria-label={
                                link.external
                                    ? `${link.name} (opens in a new tab)`
                                    : `Email ${personalInfo.email}`
                            }
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white"
                        >
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 flex items-center justify-center transition-colors flex-shrink-0">
                                <link.icon size={16} className="text-neutral-600 dark:text-neutral-400" />
                            </div>
                            <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium truncate">
                                {link.name}
                            </span>
                        </a>
                    </motion.li>
                ))}
            </motion.ul>
        </motion.section>
    );
}
