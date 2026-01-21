"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Github, Mail, Link2, Instagram, Facebook } from "lucide-react";
import { personalInfo } from "@/lib/data";
import { fadeInUp } from "@/lib/utils";

const socialLinks = [
    { name: "GitHub", href: personalInfo.github, icon: Github },
    { name: "Instagram", href: personalInfo.instagram, icon: Instagram },
    { name: "Facebook", href: personalInfo.facebook, icon: Facebook },


];

export function SocialLinks() {
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
                <Link2 size={18} className="text-neutral-500" />
                Social Links
            </h2>

            <div className="space-y-2">
                {socialLinks.map((link, index) => (
                    <motion.a
                        key={link.name}
                        href={link.href}
                        target={link.name !== "Email" ? "_blank" : undefined}
                        rel={link.name !== "Email" ? "noopener noreferrer" : undefined}
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 group-hover:bg-neutral-200 dark:group-hover:bg-neutral-700 flex items-center justify-center transition-colors">
                            <link.icon size={16} className="text-neutral-600 dark:text-neutral-400" />
                        </div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 font-medium">
                            {link.name}
                        </span>
                    </motion.a>
                ))}
            </div>
        </motion.div>
    );
}
