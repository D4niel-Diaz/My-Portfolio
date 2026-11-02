import { Award, Trophy } from "lucide-react";
import { achievements } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";

export function Achievements() {
    return (
        <section aria-labelledby="achievements-heading" data-reveal>
            <SectionHeading id="achievements-heading" icon={Trophy} className="mb-4">Achievements</SectionHeading>
            <ul className="achievement-grid">
                {achievements.map((achievement) => (
                    <li key={achievement} data-reveal>
                        <span className="achievement-icon" aria-hidden="true"><Award /></span>
                        <p>{achievement}</p>
                    </li>
                ))}
            </ul>
        </section>
    );
}
