"use client";

import { useEffect, useState } from "react";
import { navLinks, personalInfo } from "@/lib/data";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";

const orderedNames = ["Home", "Projects", "Experience", "Tech", "About", "Highlights", "Gallery", "Contact"];
const availableLinks = [
    { name: "Home", href: "#home" },
    ...navLinks.map(({ name, href }) => ({ name: name === "Stack" ? "Tech" : name, href })),
    { name: "Highlights", href: "#achievements" },
    { name: "Gallery", href: "#gallery" },
];
const navigation = orderedNames
    .map((name) => availableLinks.find((link) => link.name === name))
    .filter((link): link is { name: string; href: string } => link !== undefined);

export function Sidebar() {
    const [activeId, setActiveId] = useState("home");

    useEffect(() => {
        const sections = navigation
            .map(({ href }) => document.querySelector<HTMLElement>(href))
            .filter((section): section is HTMLElement => section !== null);
        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible[0]) setActiveId(visible[0].target.id);
            },
            { rootMargin: "-18% 0px -68% 0px", threshold: 0 }
        );
        sections.forEach((section) => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    return (
        <header className="site-header">
            <div className="site-header-inner">
                <a href="#home" className="sidebar-brand" aria-label={`${personalInfo.name}, home`}>
                    <span>{personalInfo.name}</span><i aria-hidden="true" />
                </a>
                <nav className="sidebar-nav" aria-label="Main navigation">
                    {navigation.map((link) => {
                        const id = link.href.slice(1);
                        return (
                            <a href={link.href} key={link.href} aria-current={activeId === id ? "location" : undefined}>
                                {link.name}
                            </a>
                        );
                    })}
                </nav>
                <div className="header-actions">
                    <ThemeToggle />
                    <MobileNav activeId={activeId} />
                </div>
            </div>
        </header>
    );
}
