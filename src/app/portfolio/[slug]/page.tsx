import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import IPhoneFrame from "@/components/IPhoneFrame";
import ProjectMedia from "@/components/ProjectMedia";
import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import Reveal from "@/components/Reveal";
import { brand, type Project } from "@/data/site";
import { platformOf } from "@/lib/projectImage";
import { projectBySlug, projects } from "@/content/projects";
import { getPublishedPosts } from "@/lib/publicContent";
import { postsForProject } from "@/lib/relatedPosts";

// Every project is in code, so every case study is built ahead of time.
// Re-checked every 5 minutes (and on a post save) for its blog posts.
export const dynamicParams = false;
export const revalidate = 300;

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — React Native Case Study`;
  const by =
    project.kind === "hobby"
      ? `A hobby app built by ${brand.founder}, a React Native developer in Jaipur, India, under Techtiten.`
      : `Built at work by ${brand.founder}, a React Native developer in Jaipur, India.`;
  const description = `${project.tagline ?? project.description} ${by}`;
  const image = project.cover ?? project.screenshots?.[0];

  return {
    title,
    description,
    alternates: { canonical: `/portfolio/${project.slug}` },
    openGraph: {
      title: `${project.title} · Techtiten`,
      description,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

// one column per fact, so a 3-fact project has no empty cell
const FACT_COLS: Record<number, string> = { 2: "md:grid-cols-2", 3: "md:grid-cols-3", 4: "md:grid-cols-4" };

const PLATFORM_LABEL = { mobile: "Mobile app", web: "Web app", both: "Mobile + web" } as const;

/** "570K+ | Active users" -> { value, label } */
function parseHighlight(line: string) {
  const [value, ...rest] = line.split("|");
  return { value: value.trim(), label: rest.join("|").trim() };
}

function RelatedCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-colors hover:border-mint/60"
    >
      <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-2xl border border-border bg-bg-raised font-display text-xl font-bold text-mint">
        {project.icon ? (
          // eslint-disable-next-line @next/next/no-img-element -- static icon in public/projects
          <img src={project.icon} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          project.title.charAt(0)
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="font-display font-bold text-ink group-hover:text-mint">{project.title}</span>
          <ArrowUpRight size={14} className="shrink-0 text-ink-faint group-hover:text-mint" />
        </span>
        <span className="mono-label mt-1 block text-[10px] text-ink-faint">{project.status}</span>
        {project.tagline ? <span className="mt-2 block text-sm text-ink-soft">{project.tagline}</span> : null}
      </span>
    </Link>
  );
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  // related: the same kind first (hobby next to hobby), then the rest
  const others = [
    ...projects.filter((p) => p.slug !== project.slug && p.kind === project.kind),
    ...projects.filter((p) => p.slug !== project.slug && p.kind !== project.kind),
  ].slice(0, 3);
  // Blog posts about this app (best effort: the page still renders if
  // Firestore can't be reached).
  const posts = postsForProject(await getPublishedPosts().catch(() => []), project.slug);
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
          href={project.kind === "work" ? "/portfolio#work" : "/portfolio"}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-mint"
        >
          <ArrowLeft size={14} /> All projects
        </Link>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="mono-label rounded-full border border-border px-3 py-1 text-[11px] text-ink-faint">
            {project.kind === "hobby" ? "Hobby project" : "Built at work"}
          </span>
          <span className="mono-label rounded-full border border-border px-3 py-1 text-[11px] text-ink-faint">
            {project.status}
          </span>
          {project.currentlyWorkingOn && (
            <span className="mono-label rounded-full bg-mint px-3 py-1 text-[11px] text-bg">Currently building</span>
          )}
        </div>
        <div className="mt-4 flex items-center gap-4">
          {project.icon ? (
            // eslint-disable-next-line @next/next/no-img-element -- static icon in public/projects
            <img
              src={project.icon}
              alt=""
              className="h-14 w-14 rounded-2xl border border-border md:h-16 md:w-16"
            />
          ) : null}
          <h1 className="font-display text-5xl font-bold tracking-tight text-ink md:text-6xl">{project.title}</h1>
        </div>
        {project.tagline ? <p className="mt-4 max-w-2xl text-xl text-ink-soft md:text-2xl">{project.tagline}</p> : null}
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

      {/* ── Overview, then facts as one row (no empty column beside the text) ── */}
      <Reveal delay={0.1}>
        <div className="mt-16">
          <p className="mono-label mb-4 text-xs text-mint">Overview</p>
          <p className="max-w-3xl text-lg leading-relaxed text-ink-soft">{project.description}</p>
          <dl
            className={`mt-8 grid ${facts.length % 2 ? "grid-cols-1" : "grid-cols-2"} gap-px overflow-hidden rounded-2xl border border-border bg-border ${FACT_COLS[facts.length] ?? "md:grid-cols-4"}`}
          >
            {facts.map((f) => (
              <div key={f.label} className="bg-bg-card p-4">
                <dt className="mono-label text-[10px] text-ink-faint">{f.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
          {project.tech.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {project.tech.map((t) => (
                <span key={t} className="mono-label rounded-full border border-border px-2.5 py-1 text-[10px] text-ink-soft">
                  {t}
                </span>
              ))}
            </div>
          )}
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
                <IPhoneFrame
                  key={src + i}
                  src={src}
                  alt={`${project.title} screen ${i + 1}`}
                  inset={project.screenshotsInset}
                />
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
                <li key={feature} className="flex items-start gap-3 rounded-xl border border-border bg-bg-card p-4">
                  <Check size={16} className="mt-0.5 shrink-0 text-mint" />
                  <span className="text-sm text-ink-soft">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      )}

      {/* ── Blog posts about this app ─────────────────────────── */}
      {posts.length > 0 && (
        <Reveal delay={0.14}>
          <div className="mt-20">
            <div className="mb-6 flex items-end justify-between gap-4">
              <p className="mono-label text-xs text-mint">Written about {project.title}</p>
              <Link href="/blog" className="text-xs text-ink-faint hover:text-mint">
                All notes →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {posts.slice(0, 4).map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex gap-4 overflow-hidden rounded-2xl border border-border bg-bg-card p-4 transition-colors hover:border-mint/60"
                >
                  {post.coverImage ? (
                    // eslint-disable-next-line @next/next/no-img-element -- post cover (ImageKit)
                    <img
                      src={post.coverImage}
                      alt=""
                      loading="lazy"
                      className="h-20 w-28 shrink-0 rounded-xl border border-border object-cover"
                    />
                  ) : null}
                  <span className="min-w-0">
                    <span className="block font-display font-bold leading-snug text-ink group-hover:text-mint">
                      {post.title}
                    </span>
                    <span className="mono-label mt-2 block text-[10px] text-ink-faint">
                      {new Date(post.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}

      {/* ── More projects ───────────────────────────────────── */}
      {others.length > 0 && (
        <Reveal delay={0.15}>
          <div className="mt-24 border-t border-border-soft/60 pt-10">
            <p className="mono-label mb-6 text-xs text-violet">More projects</p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
                <RelatedCard key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </div>
  );
}
