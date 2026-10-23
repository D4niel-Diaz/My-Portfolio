import type { HTMLAttributes } from "react";

type CardProps = HTMLAttributes<HTMLDivElement>;

/**
 * The surface every section on the page sits on. Purely presentational — the
 * semantic `section` and its heading live inside, supplied by the caller.
 */
export function Card({ className = "", children, ...props }: CardProps) {
    return (
        <div
            className={`portfolio-card ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
