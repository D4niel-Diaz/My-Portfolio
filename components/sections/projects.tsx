import { FolderOpen, ExternalLink } from "lucide-react";
import Image from "next/image";
import { projects } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

const VISIBLE_TAGS = 2;

export function Projects() {
    return (
        <section aria-labelledby="projects-heading" data-reveal>
            <SectionHeading id="projects-heading" icon={FolderOpen} className="mb-4">Projects</SectionHeading>
            <p className="projects-intro">Selected web applications and backend systems, built with the tools I use most.</p>
            <div className="project-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {projects.map((project, projectIndex) => {
                    const hasUrl = project.url.length > 0;
                    const CardWrapper = hasUrl ? "a" : "article";
                    const hiddenTags = project.tags.length - VISIBLE_TAGS;

                    return (
                        <CardWrapper
                            key={project.title}
                            {...(hasUrl ? {
                                href: project.url,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                "aria-label": `${project.title} — ${project.description} (opens in a new tab)`,
                            } : {})}
                            data-reveal
                            title={`${project.title} — ${project.description}`}
                            className={`project-card group block bg-neutral-100 dark:bg-neutral-800 rounded-xl overflow-hidden ${hasUrl ? "cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 dark:focus-visible:ring-white" : ""}`}
                        >
                            <div className="project-image aspect-video bg-neutral-200 dark:bg-neutral-700 relative overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={`${project.title} screenshot`}
                                    width={800}
                                    height={450}
                                    sizes="(max-width: 560px) 100vw, (max-width: 1023px) 50vw, 33vw"
                                    className="w-full h-full object-cover"
                                />
                                {hasUrl && <ExternalLink size={18} aria-hidden="true" className="project-external-icon" />}
                            </div>
                            <div className="project-info">
                                <div className="project-meta"><span>{String(projectIndex + 1).padStart(2, "0")}</span><span>{project.tags[0]}</span></div>
                                <h3 className="font-medium text-neutral-900 dark:text-white text-lg mb-2">{project.title}</h3>
                                <p className="project-description mb-3 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">{project.description}</p>
                                <div className="flex flex-wrap gap-1">
                                    {project.tags.slice(0, VISIBLE_TAGS).map((tag) => (
                                        <span key={tag} className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400">{tag}</span>
                                    ))}
                                    {hiddenTags > 0 && (
                                        <span className="px-1.5 py-0.5 text-[9px] font-medium rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400" title={project.tags.slice(VISIBLE_TAGS).join(", ")}>+{hiddenTags}</span>
                                    )}
                                </div>
                            </div>
                        </CardWrapper>
                    );
                })}
            </div>
        </section>
    );
}
