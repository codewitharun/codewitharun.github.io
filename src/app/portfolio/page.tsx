import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Reveal from "@/components/Reveal";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import type { Project } from "@/data/site";
import { hobbyProjects, workProjects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Portfolio — React Native Apps by Arun Kumar",
  description:
    "Hobby apps Arun Kumar builds under Techtiten (FitPrep, EzySplit) and apps he has built at work as a React Native developer in Jaipur, India.",
  alternates: { canonical: "/portfolio" },
};

// Work apps have no public screenshots, so their cards skip the big media
// area and lead with a small mark instead (no tall empty tiles).
function ProjectCard({ project, index, compact }: { project: Project; index: number; compact?: boolean }) {
  return (
    <Reveal delay={(index % 2) * 0.1}>
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors hover:border-mint/60">
        {compact ? null : (
          <ProjectMedia
            project={project}
            className="relative overflow-visible border-b border-border bg-bg-raised/40"
            showStatusBadge
          />
        )}
        <div className="flex flex-1 flex-col p-6">
          <div className="flex items-center gap-3">
            {compact ? (
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-border bg-bg-raised font-display text-lg font-bold text-mint">
                {project.title.charAt(0)}
              </span>
            ) : null}
            <Link href={`/portfolio/${project.slug}`} className="group/title w-fit">
              <h3 className="font-display text-xl font-bold text-ink group-hover/title:text-mint">{project.title}</h3>
            </Link>
          </div>
          <p className="mono-label mt-1 text-[11px] text-ink-faint">
            {project.kind === "work" ? `${project.role} · ` : ""}
            {project.status}
          </p>
          <p className="mt-3 flex-1 text-sm text-ink-soft">{project.tagline || project.description}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.tech.map((t) => (
              <span key={t} className="rounded-full border border-border-soft px-2.5 py-1 text-[10px] text-ink-faint">
                {t}
              </span>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Link
              href={`/portfolio/${project.slug}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint hover:underline"
            >
              View details <ArrowUpRight size={14} />
            </Link>
            <ProjectLinkButtons links={project.links} className="flex flex-wrap gap-4" />
          </div>
        </div>
      </article>
    </Reveal>
  );
}

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <p className="mono-label mb-3 text-xs text-mint">Portfolio</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">Things I&apos;ve built</h1>
        <p className="mt-4 max-w-2xl text-ink-soft">
          My own hobby apps under Techtiten, built in my spare time, and apps I&apos;ve built at work as a React
          Native developer.
        </p>
      </Reveal>

      <section className="mt-14" aria-labelledby="hobby">
        <Reveal>
          <h2 id="hobby" className="mono-label mb-6 text-xs text-violet">
            Hobby projects · Techtiten
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {hobbyProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </section>

      <section id="work" className="mt-20 scroll-mt-24" aria-labelledby="work-title">
        <Reveal>
          <h2 id="work-title" className="mono-label mb-2 text-xs text-violet">
            Built at work
          </h2>
          <p className="mb-6 max-w-2xl text-sm text-ink-faint">
            Apps I&apos;ve worked on as part of my job. Some names are kept private.
          </p>
        </Reveal>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {workProjects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
