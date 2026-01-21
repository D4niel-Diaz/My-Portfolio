"use client";

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
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 py-8 px-4 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        {/* Hero Section with Theme Toggle */}
        <Hero />

        {/* Divider */}
        <hr className="border-neutral-200 dark:border-neutral-800 my-6" />

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Column - About & Tech Stack */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* About Card */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors duration-300">
              <About />
            </div>

            {/* Local Time Card - Mobile only (shows after About on mobile) */}
            <div className="lg:hidden bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300">
              <TimezoneClock />
            </div>

            {/* Tech Stack Card - flex-grow to fill space */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex-grow transition-colors duration-300">
              <TechStack />
            </div>
          </div>

          {/* Right Column - Time & Experience */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* Timezone Clock Card - Desktop only */}
            <div className="hidden lg:block bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-4 transition-colors duration-300">
              <TimezoneClock />
            </div>

            {/* Experience Card - flex-grow to fill space */}
            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 flex-grow transition-colors duration-300">
              <Experience />
            </div>
          </div>
        </div>

        {/* Achievements & Social Links Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Achievements Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors duration-300">
            <Achievements />
          </div>

          {/* Social Links Card */}
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 transition-colors duration-300">
            <SocialLinks />
          </div>
        </div>

        {/* Projects Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mt-6 transition-colors duration-300">
          <Projects />
        </div>

        {/* Gallery Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 mt-6 transition-colors duration-300">
          <Gallery />
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
