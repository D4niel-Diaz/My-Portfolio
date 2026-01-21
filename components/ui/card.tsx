"use client";

import { type HTMLAttributes, forwardRef } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className = "", hover = true, children, ...props }, ref) => {
        const baseStyles =
            "rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6";
        const hoverStyles = hover
            ? "transition-all duration-300 hover:shadow-lg hover:shadow-neutral-200/50 dark:hover:shadow-neutral-900/50 hover:-translate-y-1"
            : "";

        return (
            <div ref={ref} className={`${baseStyles} ${hoverStyles} ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

Card.displayName = "Card";

interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> { }

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div ref={ref} className={`mb-4 ${className}`} {...props}>
                {children}
            </div>
        );
    }
);

CardHeader.displayName = "CardHeader";

interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> { }

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <h3
                ref={ref}
                className={`text-xl font-semibold text-neutral-900 dark:text-white ${className}`}
                {...props}
            >
                {children}
            </h3>
        );
    }
);

CardTitle.displayName = "CardTitle";

interface CardDescriptionProps extends HTMLAttributes<HTMLParagraphElement> { }

const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <p
                ref={ref}
                className={`text-neutral-600 dark:text-neutral-400 ${className}`}
                {...props}
            >
                {children}
            </p>
        );
    }
);

CardDescription.displayName = "CardDescription";

interface CardContentProps extends HTMLAttributes<HTMLDivElement> { }

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
    ({ className = "", children, ...props }, ref) => {
        return (
            <div ref={ref} className={className} {...props}>
                {children}
            </div>
        );
    }
);

CardContent.displayName = "CardContent";

export { Card, CardHeader, CardTitle, CardDescription, CardContent };
