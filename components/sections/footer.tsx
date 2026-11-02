import { personalInfo, navLinks } from "@/lib/data";
import { TimezoneClock } from "@/components/sections/timezone-clock";

export function Footer() {
    return (
        <footer className="site-footer">
            <div className="site-footer-inner">
                <div className="footer-profile">
                    <a href="#home" className="footer-name">{personalInfo.name}</a>
                    <p>{personalInfo.role}</p>
                </div>
                <div className="footer-time"><TimezoneClock /></div>
                <nav className="footer-navigation" aria-label="Footer navigation">
                    <span className="footer-label">Explore</span>
                    {navLinks.map((link) => <a key={link.href} href={link.href}>{link.name}</a>)}
                </nav>
                <div className="footer-bottom">
                    <span>© {new Date().getFullYear()} {personalInfo.name}</span>
                    <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
            </div>
        </footer>
    );
}
