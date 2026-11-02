import { Briefcase } from "lucide-react";
import { experiences } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

export function Experience() {
    return (
        <section aria-labelledby="experience-heading" data-reveal>
            <SectionHeading id="experience-heading" icon={Briefcase} className="mb-4">Experience</SectionHeading>
            <ol className="experience-grid">
                {experiences.map((exp) => (
                    <li key={exp.title} className="experience-item" data-reveal>
                        <h3 className="font-medium text-neutral-900 dark:text-white text-base text-balance">{exp.title}</h3>
                        <p className="experience-client text-xs text-neutral-500 dark:text-neutral-500 mb-3">{exp.client}</p>
                        <ul>
                            {exp.description.map((line, i) => (
                                <li key={i} className="experience-description text-sm text-neutral-600 dark:text-neutral-400 flex items-start gap-2">
                                    <span className="w-1 h-1 rounded-full bg-neutral-400 mt-1.5 flex-shrink-0" aria-hidden="true" />
                                    <span className="min-w-0">{line}</span>
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ol>
        </section>
    );
}
