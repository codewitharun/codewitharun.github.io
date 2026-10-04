import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check } from "lucide-react";
import IPhoneFrame from "@/components/IPhoneFrame";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import Reveal from "@/components/Reveal";
import { brand } from "@/data/site";
import { platformOf } from "@/lib/projectImage";
import { getProjectsForBuild } from "@/lib/publicContent";

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
      images: project.image
        ? [{ url: project.image }]
        : project.screenshots?.[0]
          ? [{ url: project.screenshots[0] }]
          : undefined,
    },
  };
}

const PLATFORM_LABEL = { mobile: "Mobile app", web: "Web app", both: "Mobile + web" } as const;

/** "570K+ | Active users" -> { value, label } */
function parseHighlight(line: string) {
  const [value, ...rest] = line.split("|");
  return { value: value.trim(), label: rest.join("|").trim() };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, projects] = await Promise.all([getProject(slug), getProjectsForBuild()]);
  if (!project) notFound();

  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);
  const highlights = (project.highlights ?? []).map(parseHighlight).filter((h) => h.value);
  const screenshots = (project.screenshots ?? []).filter(Boolean);
  const facts = [
    { label: "Platform", value: PLATFORM_LABEL[platformOf(project)] },
    project.role ? { label: "Role", value: project.role } : null,
    project.year ? { label: "Timeline", value: project.year } : null,
    { label: "Status", value: project.status },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="mx-auto max-w-5xl px-6 py-20">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <Reveal>
        <Link
          href="/portfolio"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-mint"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="mono-label rounded-full border border-border px-3 py-1 text-[11px] text-ink-faint">
            {project.status}
          </span>
          {project.currentlyWorkingOn && (
            <span className="mono-label rounded-full bg-mint px-3 py-1 text-[11px] text-bg">
              Currently building
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-5xl font-bold tracking-tight text-ink md:text-6xl">
          {project.title}
        </h1>
        {project.tagline ? (
          <p className="mt-4 max-w-2xl text-xl text-ink-soft md:text-2xl">{project.tagline}</p>
        ) : null}
        <ProjectLinkButtons links={project.links} className="mt-6 flex flex-wrap gap-5" />
      </Reveal>

      <Reveal delay={0.05}>
        <ProjectMedia
          project={project}
          hero
          className="relative mt-10 overflow-hidden rounded-3xl border border-border bg-bg-card"
        />
      </Reveal>

      {/* ── Numbers ─────────────────────────────────────────── */}
      {highlights.length > 0 && (
        <Reveal delay={0.08}>
          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
            {highlights.slice(0, 4).map((h) => (
              <div key={h.value + h.label} className="rounded-2xl border border-border bg-bg-card p-5">
                <p className="font-display text-3xl font-bold text-ink">{h.value}</p>
                <p className="mt-1 text-sm text-ink-faint">{h.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      )}

      {/* ── Overview + facts ────────────────────────────────── */}
      <Reveal delay={0.1}>
        <div className="mt-16 grid gap-10 md:grid-cols-[1fr_16rem]">
          <div>
            <p className="mono-label mb-4 text-xs text-mint">Overview</p>
            <p className="text-lg leading-relaxed text-ink-soft">{project.description}</p>
          </div>
          <dl className="space-y-5 rounded-2xl border border-border bg-bg-card p-5">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="mono-label text-[10px] text-ink-faint">{f.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
            {project.tech.length > 0 && (
              <div>
                <dt className="mono-label text-[10px] text-ink-faint">Stack</dt>
                <dd className="mt-2 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="mono-label rounded-full border border-border px-2.5 py-1 text-[10px] text-ink-soft"
                    >
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </Reveal>

      {/* ── Screens ─────────────────────────────────────────── */}
      {screenshots.length > 1 && (
        <Reveal delay={0.1}>
          <div className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <p className="mono-label text-xs text-mint">Screens</p>
              <p className="text-xs text-ink-faint">Swipe to see more →</p>
            </div>
            <div className="screen-strip">
              {screenshots.map((src, i) => (
                <IPhoneFrame key={src + i} src={src} alt={`${project.title} screen ${i + 1}`} />
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* ── Features ────────────────────────────────────────── */}
      {project.features && project.features.length > 0 && (
        <Reveal delay={0.12}>
          <div className="mt-16">
            <p className="mono-label mb-6 text-xs text-mint">What it does</p>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-4"
                >
                  <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                  <span className="text-sm text-ink-soft">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* ── More projects ───────────────────────────────────── */}
      {others.length > 0 && (
        <Reveal delay={0.15}>
          <div className="mt-24 border-t border-border-soft/60 pt-10">
            <p className="mono-label mb-6 text-xs text-violet">More from Techtiten</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <Link
                  key={p.slug}
                  href={`/portfolio/${p.slug}`}
                  className="group overflow-hidden rounded-2xl border border-border bg-bg-card transition-colors hover:border-mint/60"
                >
                  <ProjectMedia project={p} className="relative border-b border-border" />
                  <div className="p-4">
                    <p className="font-display font-bold text-ink group-hover:text-mint">{p.title}</p>
                    <p className="mono-label mt-1 text-[10px] text-ink-faint">{p.status}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
