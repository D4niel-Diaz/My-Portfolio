import type { HTMLAttributes } from "react";

const PADDING = {
    sm: "p-4",
    md: "p-6",
} as const;

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    padding?: keyof typeof PADDING;
}

/**
 * The surface every section on the page sits on. Purely presentational — the
 * semantic `section` and its heading live inside, supplied by the caller.
 */
export function Card({ padding = "md", className = "", children, ...props }: CardProps) {
    return (
        <div
            className={`rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 ${PADDING[padding]} transition-colors duration-300 ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
