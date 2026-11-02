import { Card } from "@/components/ui/card";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { TechStack } from "@/components/sections/tech-stack";
import { Experience } from "@/components/sections/experience";
import { Achievements } from "@/components/sections/achievements";
import { SocialLinks } from "@/components/sections/social-links";
import { Sidebar } from "@/components/layout/sidebar";
import { Projects } from "@/components/sections/projects";
import { Gallery } from "@/components/sections/gallery";
import { Footer } from "@/components/sections/footer";

function PortfolioSection({ id, index, label, children }: {
  id: string;
  index: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="numbered-section" id={id}>
      <div className="section-kicker"><span>{index}</span>{label}</div>
      <Card>{children}</Card>
    </section>
  );
}

export default function Home() {
  return (
    <div className="portfolio-shell">
      <Sidebar />
      <main className="portfolio-main" id="main">
        <Hero />
        <div className="content-wrap">
          <div className="credibility-strip" aria-label="Education and core technologies" data-reveal>
            <div data-reveal><span className="strip-mark">01</span><strong>BS Information Technology</strong><small>GRADUATE</small></div>
            <div data-reveal><span className="strip-mark">02</span><strong>Laravel · React</strong><small>CORE STACK</small></div>
            <div data-reveal><span className="strip-mark">03</span><strong>Vercel · Render</strong><small>DEPLOYMENT</small></div>
          </div>

          <PortfolioSection id="projects" index="01" label="Selected projects"><Projects /></PortfolioSection>
          <PortfolioSection id="experience" index="02" label="Experience"><Experience /></PortfolioSection>
          <PortfolioSection id="tech" index="03" label="Technology"><TechStack /></PortfolioSection>
          <PortfolioSection id="about" index="04" label="About"><About /></PortfolioSection>
          <PortfolioSection id="achievements" index="05" label="Highlights"><Achievements /></PortfolioSection>
          <PortfolioSection id="gallery" index="06" label="Project gallery"><Gallery /></PortfolioSection>
          <PortfolioSection id="contact" index="07" label="Contact"><SocialLinks /></PortfolioSection>
        </div>
      </main>
      <Footer />
    </div>
  );
}
