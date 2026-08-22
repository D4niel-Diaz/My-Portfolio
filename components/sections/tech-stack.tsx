"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Code2 } from "lucide-react";
import { techStack } from "@/lib/data";
import { fadeInUp, popItem, staggerParent, respectMotion } from "@/lib/motion";
import { useReveal } from "@/lib/hooks/use-reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { LogoLoop, type LogoItem } from "@/components/ui/logo-loop";
import { TECH_LOGOS } from "./tech-logos";

const categoryLabels: Record<keyof typeof techStack, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database & Cloud",
    other: "Other Skills"
};

/**
 * Every tech that has a brand mark, flattened in the order it appears in the
 * data. Built once at module scope: LogoLoop is memoised and measures on
 * `logos` identity, so a new array each render would thrash it.
 */
const TECH_LOGO_ITEMS: LogoItem[] = Object.values(techStack)
    .flat()
    .flatMap((tech) => {
        const logo = TECH_LOGOS[tech];
        if (!logo) return [];
        const Icon = logo.icon;
        return [{ node: <Icon />, title: tech, ariaLabel: tech, href: logo.href }];
    });

/** Uniform cards that wrap into as many columns as the container allows. */
const GRID_CLASS = "grid grid-cols-[repeat(auto-fill,minmax(5.25rem,1fr))] gap-2";

const CARD_CLASS =
    "flex flex-col items-center justify-center gap-2 rounded-xl border border-neutral-200 dark:border-neutral-700 px-2 py-3.5 text-center transition-colors hover:border-neutral-400 dark:hover:border-neutral-500";

/**
 * Brand mark over its label. Icons carry their own brand colour where one
 * exists; the rest inherit the theme's text colour so black/white marks such as
 * GitHub and Vercel stay legible in both themes.
 */
function TechMark({ tech }: { tech: string }) {
    const logo = TECH_LOGOS[tech];
    const Icon = logo?.icon ?? Code2;
    return (
        <>
            <Icon
                aria-hidden="true"
                className="w-7 h-7 text-neutral-900 dark:text-white"
                style={logo?.color ? { color: logo.color } : undefined}
            />
            <span className="text-xs font-semibold leading-tight text-neutral-800 dark:text-neutral-200">
                {tech}
            </span>
        </>
    );
}

export function TechStack() {
    const { ref, animate } = useReveal();
    const reduced = useReducedMotion();

    const categories = Object.keys(techStack) as Array<keyof typeof techStack>;

    const chip = respectMotion(popItem, reduced);

    return (
        <motion.section
            ref={ref}
            aria-labelledby="tech-stack-heading"
            variants={fadeInUp}
            initial="hidden"
            animate={animate}
        >
            <SectionHeading id="tech-stack-heading" icon={Code2} className="mb-3">
                Tech Stack
            </SectionHeading>

            {/* Marquee of everything with a brand mark, above the
                categorised cards that name them. */}
            <LogoLoop
                logos={TECH_LOGO_ITEMS}
                speed={40}
                direction="left"
                logoHeight={26}
                gap={36}
                hoverSpeed={0}
                scaleOnHover
                fadeOut
                fadeOutColor="var(--card-surface)"
                ariaLabel="Technologies I work with"
                className="mb-5 text-neutral-500 dark:text-neutral-400"
            />

            <div className="space-y-4">
                {categories.map((category, categoryIndex) => (
                    <div key={category}>
                        <h3 className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-2">
                            {categoryLabels[category]}
                        </h3>
                        <motion.ul
                            variants={staggerParent(0.03, categoryIndex * 0.08)}
                            initial="hidden"
                            animate={animate}
                            className={GRID_CLASS}
                        >
                            {techStack[category].map((tech) => (
                                <motion.li key={tech} variants={chip} className={CARD_CLASS}>
                                    <TechMark tech={tech} />
                                </motion.li>
                            ))}
                        </motion.ul>
                    </div>
                ))}
            </div>
        </motion.section>
    );
}
