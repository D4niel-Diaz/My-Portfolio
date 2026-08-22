import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
    /** Referenced by the owning section's `aria-labelledby`. */
    id: string;
    icon: LucideIcon;
    children: ReactNode;
    /** Spacing only — sections sit at different distances from their content. */
    className?: string;
}

/** The `h2` every card section leads with: icon, label, consistent type. */
export function SectionHeading({ id, icon: Icon, children, className = "" }: SectionHeadingProps) {
    return (
        <h2
            id={id}
            className={`text-lg font-semibold text-neutral-900 dark:text-white flex items-center gap-2 ${className}`}
        >
            <Icon size={18} className="text-neutral-500" aria-hidden="true" />
            {children}
        </h2>
    );
}
