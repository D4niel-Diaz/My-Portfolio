"use client";

import { Code2 } from "lucide-react";
import { techStack } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { LogoLoop, type LogoItem } from "@/components/ui/logo-loop";
import { TECH_LOGOS } from "./tech-logos";

const categoryLabels: Record<keyof typeof techStack, string> = {
    frontend: "Frontend",
    backend: "Backend",
    database: "Database & Cloud",
    tools: "Tools"
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
const GRID_CLASS = "tech-chip-list flex flex-wrap gap-2";

const CARD_CLASS =
    "tech-chip inline-flex items-center gap-2 rounded-lg border border-neutral-200 dark:border-neutral-700 px-3 py-2 text-left transition-colors hover:border-neutral-400 dark:hover:border-neutral-500";

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
                className="h-5 w-5 flex-shrink-0 text-neutral-900 dark:text-white"
                style={logo?.color ? { color: logo.color } : undefined}
            />
            <span className="text-xs font-semibold leading-tight text-neutral-800 dark:text-neutral-200">
                {tech}
            </span>
        </>
    );
}

export function TechStack() {
    const categories = Object.keys(techStack) as Array<keyof typeof techStack>;

    return (
        <section aria-labelledby="tech-stack-heading" data-reveal>
            <SectionHeading id="tech-stack-heading" icon={Code2} className="mb-3">
                Tech Stack
            </SectionHeading>

            {/* Marquee of everything with a brand mark, above the
                categorised cards that name them. */}
            <div data-reveal>
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
            </div>

            <div className="tech-categories">
                {categories.map((category) => (
                    <div key={category} className="tech-category">
                        <h3 data-reveal className="text-xs font-medium uppercase tracking-widest text-neutral-500 dark:text-neutral-500 mb-3">
                            {categoryLabels[category]}
                        </h3>
                        <ul className={GRID_CLASS}>
                            {techStack[category].map((tech) => (
                                <li key={tech} data-reveal className={CARD_CLASS}>
                                    <TechMark tech={tech} />
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </section>
    );
}
