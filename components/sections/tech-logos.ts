import type { ComponentType, SVGProps } from "react";
import {
    SiHtml5,
    SiCss,
    SiJavascript,
    SiReact,
    SiTailwindcss,
    SiPhp,
    SiLaravel,
    SiMysql,
    SiPostgresql,
    SiGithub,
    SiVercel,
    SiRender,
    SiFigma,
    SiPostman,
    SiDocker,
} from "react-icons/si";
import { Webhook, FileCode2 } from "lucide-react";

/** Both react-icons and lucide marks satisfy this, so they can share one map. */
type TechIcon = ComponentType<SVGProps<SVGSVGElement>>;

type TechLogo = {
    icon: TechIcon;
    href: string;
    /**
     * simple-icons brand hex. Omitted on marks that are essentially black or
     * white — those follow the theme's text colour instead, so they stay
     * visible in dark mode.
     */
    color?: string;
};

/**
 * Brand marks for the entries in `techStack`, keyed by the exact label used
 * there so the two can't drift apart silently.
 *
 * "REST APIs" is a concept rather than a product, and simple-icons carries no
 * VS Code mark (Microsoft's is trademark-restricted), so both fall back to a
 * generic lucide glyph.
 */
export const TECH_LOGOS: Record<string, TechLogo> = {
    HTML: { icon: SiHtml5, href: "https://developer.mozilla.org/docs/Web/HTML", color: "#E34F26" },
    CSS: { icon: SiCss, href: "https://developer.mozilla.org/docs/Web/CSS", color: "#663399" },
    JavaScript: { icon: SiJavascript, href: "https://developer.mozilla.org/docs/Web/JavaScript", color: "#F7DF1E" },
    React: { icon: SiReact, href: "https://react.dev", color: "#61DAFB" },
    "Tailwind CSS": { icon: SiTailwindcss, href: "https://tailwindcss.com", color: "#06B6D4" },
    PHP: { icon: SiPhp, href: "https://www.php.net", color: "#777BB4" },
    Laravel: { icon: SiLaravel, href: "https://laravel.com", color: "#FF2D20" },
    "REST APIs": { icon: Webhook, href: "https://developer.mozilla.org/docs/Web/HTTP" },
    MySQL: { icon: SiMysql, href: "https://www.mysql.com", color: "#4479A1" },
    PostgreSQL: { icon: SiPostgresql, href: "https://www.postgresql.org", color: "#4169E1" },
    "Git/GitHub": { icon: SiGithub, href: "https://github.com" },
    Vercel: { icon: SiVercel, href: "https://vercel.com" },
    Render: { icon: SiRender, href: "https://render.com", color: "#46E3B7" },
    Vscode: { icon: FileCode2, href: "https://code.visualstudio.com", color: "#007ACC" },
    Figma: { icon: SiFigma, href: "https://www.figma.com", color: "#F24E1E" },
    Postman: { icon: SiPostman, href: "https://www.postman.com", color: "#FF6C37" },
    Docker: { icon: SiDocker, href: "https://www.docker.com", color: "#2496ED" },
};
