import { Card } from "@/components/ui/card";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Experience } from "@/components/sections/experience";
import { Achievements } from "@/components/sections/achievements";
import { SocialLinks } from "@/components/sections/social-links";
import { TimezoneClock } from "@/components/sections/timezone-clock";
import { Projects } from "@/components/sections/projects";
import { Gallery } from "@/components/sections/gallery";
import { Footer } from "@/components/sections/footer";
import { navLinks, personalInfo } from "@/lib/data";
import { Github, Mail } from "lucide-react";

function Sidebar() {
  return (
    <aside className="site-sidebar" aria-label="Portfolio navigation">
      <a href="#home" className="sidebar-brand">Daniel Diaz<span> / developer</span></a>
      <nav className="sidebar-nav" aria-label="Main navigation">
        {navLinks.map((link, index) => (
          <a href={link.href} key={link.href}><span>{String(index + 1).padStart(2, "0")}</span>{link.name}</a>
        ))}
        <a href="#gallery"><span>06</span>Gallery</a>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-timezone"><TimezoneClock /></div>
        <div className="sidebar-socials">
          <a href={personalInfo.github} target="_blank" rel="noreferrer" aria-label="GitHub profile"><Github size={17} /></a>
          <a href={`mailto:${personalInfo.email}`} aria-label="Email Daniel"><Mail size={17} /></a>
        </div>
        <p>For work and collaborations,<br />reach me at</p>
        <a className="sidebar-email" href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
      </div>
    </aside>
  );
}

export default function Home() {
  return (
    <main className="portfolio-shell">
      <Sidebar />
      <div className="portfolio-main">
        <div className="mobile-brand"><a href="#home">Daniel Diaz</a><span>Full-Stack Web Developer</span></div>
        <div className="content-wrap">
          <Hero />
          <div className="section-divider" />
          <div className="credibility-strip">
            <div><span className="strip-mark">01</span><strong>BS Information Technology</strong><small>GRADUATE</small></div>
            <div><span className="strip-mark">02</span><strong>Laravel · React</strong><small>CORE STACK</small></div>
            <div><span className="strip-mark">03</span><strong>Vercel · Render</strong><small>DEPLOYMENT</small></div>
          </div>

          <section className="numbered-section" id="about"><div className="section-kicker">01 — about</div><Card><About /></Card></section>
          <section className="numbered-section" id="tech"><div className="section-kicker">02 — stack</div><Card><TechStack /></Card></section>
          <section className="numbered-section" id="experience"><div className="section-kicker">03 — experience</div><Card><Experience /></Card></section>
          <section className="numbered-section" id="projects"><div className="section-kicker">04 — projects</div><Card><Projects /></Card></section>
          <div className="split-sections">
            <section className="numbered-section" id="achievements"><div className="section-kicker">05 — highlights</div><Card><Achievements /></Card></section>
            <section className="numbered-section" id="contact"><div className="section-kicker">06 — elsewhere</div><Card><SocialLinks /></Card></section>
          </div>
          <section className="numbered-section" id="gallery"><div className="section-kicker">07 — process</div><Card><Gallery /></Card></section>
          <Footer />
        </div>
      </div>
    </main>
  );
}
