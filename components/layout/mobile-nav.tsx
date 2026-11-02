"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Menu, X } from "lucide-react";
import { navLinks } from "@/lib/data";

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

export function MobileNav({ activeId }: { activeId: string }) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(false);
    const closingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (closingTimer.current) clearTimeout(closingTimer.current);
    }, []);

    const show = () => {
        dialogRef.current?.showModal();
        setOpen(true);
    };

    const close = () => {
        const dialog = dialogRef.current;
        if (!dialog?.open || dialog.hasAttribute("data-closing")) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            dialog.close();
            setOpen(false);
            return;
        }
        dialog.setAttribute("data-closing", "");
        closingTimer.current = setTimeout(() => {
            dialog.removeAttribute("data-closing");
            if (dialog.open) dialog.close();
            setOpen(false);
        }, 220);
    };

    return (
        <>
            <button
                type="button"
                className="mobile-menu-trigger"
                aria-label={open ? "Close navigation menu" : "Open navigation menu"}
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={open ? close : show}
            >
                {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
            </button>
            <dialog
                ref={dialogRef}
                className="mobile-menu-dialog"
                aria-label="Navigation menu"
                onCancel={(event) => {
                    event.preventDefault();
                    close();
                }}
                onClose={() => setOpen(false)}
                onClick={(event) => {
                    if (event.target === dialogRef.current) close();
                }}
            >
                <div className="mobile-menu-inner">
                    <div className="mobile-menu-top">
                        <span className="section-kicker">Navigate</span>
                        <button type="button" className="mobile-menu-close" aria-label="Close navigation menu" onClick={close}>
                            <X size={20} aria-hidden="true" />
                        </button>
                    </div>
                    <nav aria-label="Mobile navigation">
                        {navigation.map((link, index) => (
                            <a
                                href={link.href}
                                key={link.href}
                                aria-current={activeId === link.href.slice(1) ? "location" : undefined}
                                style={{ "--menu-index": index } as CSSProperties}
                                onClick={close}
                            >
                                <span>{String(index + 1).padStart(2, "0")}</span>{link.name}
                            </a>
                        ))}
                    </nav>
                </div>
            </dialog>
        </>
    );
}
