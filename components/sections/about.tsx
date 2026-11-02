import { User } from "lucide-react";
import { aboutContent } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

export function About() {
    const paragraphs = aboutContent.split("\n\n");

    return (
        <section aria-labelledby="about-heading" data-reveal>
            <SectionHeading id="about-heading" icon={User} className="mb-4">About</SectionHeading>
            <div className="about-copy">
                {paragraphs.map((paragraph, index) => (
                    <p key={index} data-reveal className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed text-pretty">
                        {paragraph}
                    </p>
                ))}
            </div>
        </section>
    );
}
