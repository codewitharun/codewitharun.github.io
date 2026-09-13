import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import Reveal from "@/components/Reveal";
import { brand } from "@/data/site";
import { getProjectsForBuild } from "@/lib/projects";

export const revalidate = 300;

export async function generateStaticParams() {
  // Best-effort at build time, same reasoning as blog/[slug] — if
  // Firestore can't be reached, fall back to no pre-rendered projects
  // rather than failing the build; `revalidate` fetches them on request.
  try {
    const projects = await getProjectsForBuild();
    return projects.map((project) => ({ slug: project.slug }));
  } catch {
    return [];
  }
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

async function getProject(slug: string) {
  const projects = await getProjectsForBuild();
  return projects.find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return {};

  const title = `${project.title} — React Native Case Study`;
  const description = `${project.description} Built by ${brand.founder}, a React Native developer and software engineer in Jaipur, India, under Techtiten.`;

  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.title} · Techtiten`,
      description,
      images: project.image ? [{ url: project.image }] : undefined,
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjectsForBuild()]);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-mint"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
              {project.title}
            </h1>
            <p className="mono-label mt-2 text-xs text-ink-faint">{project.status}</p>
          </div>
          {project.currentlyWorkingOn && (
            <span className="mono-label rounded-full bg-gradient-to-r from-mint to-violet px-3 py-1 text-[11px] text-bg">
              Currently building
            </span>
          )}
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <ProjectMedia
          project={project}
          className="relative mt-10 overflow-visible rounded-2xl border border-border bg-bg-card"
        />
      </Reveal>

      <Reveal delay={0.1}>
        <p className="mt-10 max-w-2xl text-lg text-ink-soft">{project.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="mono-label rounded-full border border-border px-3 py-1 text-[10px] text-ink-faint"
            >
              {t}
            </span>
          ))}
        </div>

        <ProjectLinkButtons links={project.links} className="mt-8 flex flex-wrap gap-5" />
      </Reveal>

      {others.length > 0 && (
        <Reveal delay={0.15}>
          <div className="mt-20 border-t border-border-soft/60 pt-10">
            <p className="mono-label mb-5 text-xs text-violet">More from Techtiten</p>
            <div className="flex flex-wrap gap-4">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/portfolio/${p.slug}`}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-mint hover:text-mint"
                >
                  {p.title}
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
