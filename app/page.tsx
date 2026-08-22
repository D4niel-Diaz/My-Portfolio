// No "use client" here on purpose: this file only composes sections, so it can
// stay a server component and ship none of its own JS. Each section opts into
// the client itself.
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

export default function Home() {
  return (
    <main className="min-h-dvh bg-neutral-50 dark:bg-neutral-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <Hero />

        <hr className="border-neutral-200 dark:border-neutral-800 my-6" />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 flex flex-col gap-6">
            <Card>
              <About />
            </Card>

            {/* The clock follows About on mobile, but belongs to the right-hand
                column on desktop, so it is rendered in both and hidden in one. */}
            <Card padding="sm" className="lg:hidden">
              <TimezoneClock />
            </Card>

            <Card className="flex-grow">
              <TechStack />
            </Card>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card padding="sm" className="hidden lg:block">
              <TimezoneClock />
            </Card>

            <Card className="flex-grow">
              <Experience />
            </Card>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <Card>
            <Achievements />
          </Card>

          <Card>
            <SocialLinks />
          </Card>
        </div>

        <Card className="mt-6">
          <Projects />
        </Card>

        <Card className="mt-6">
          <Gallery />
        </Card>

        <Footer />
      </div>
    </main>
  );
}
