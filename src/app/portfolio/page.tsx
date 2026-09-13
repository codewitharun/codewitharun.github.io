import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import { projects } from "@/data/site";

export const metadata: Metadata = {
  title: "Portfolio — React Native & Software Engineering Work",
  description:
    "React Native apps and software built by Arun Kumar, a React Native developer and software engineer in Jaipur, India, under Techtiten (Tech Titan) and beyond — EzySplit, Ageas Federal Life Insurance, Sodality, and more.",
};

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="mono-label mb-3 text-xs text-mint">Portfolio</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
          Things I&apos;ve shipped
        </h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          A mix of client work and Techtiten&apos;s own products — some polished, some still
          rough at the edges. All real, all in use.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.slug} delay={(i % 2) * 0.1}>
            <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors hover:border-mint/60">
              <ProjectMedia
                project={project}
                className="relative overflow-visible border-b border-border bg-bg-raised/40"
                showFlagshipBadge
              />
              <div className="flex flex-1 flex-col p-6">
                <h2 className="font-display text-xl font-bold text-ink">{project.title}</h2>
                <p className="mono-label mt-1 text-[11px] text-ink-faint">{project.status}</p>
                <p className="mt-3 flex-1 text-sm text-ink-soft">{project.description}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-border-soft px-2.5 py-1 text-[10px] text-ink-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <ProjectLinkButtons links={project.links} className="mt-5 flex flex-wrap gap-4" />
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
