// /apps: one link for a LinkedIn / Instagram bio. Every app Arun has built,
// with its store links, read from the same published projects as
// /portfolio (Firestore, edited in /admin), so adding a project there adds
// it here too. Apps with a store listing come first.
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { FaApple, FaGithub, FaGlobe, FaGooglePlay, FaLinkedin } from "react-icons/fa";
import Reveal from "@/components/Reveal";
import { brand, socials } from "@/data/site";
import type { Project } from "@/data/site";
import { liveSite } from "@/lib/projectImage";
import { getProjectsForBuild } from "@/lib/publicContent";

export const metadata: Metadata = {
  title: "Apps by Arun Kumar",
  description:
    "Every app Arun Kumar has built and shipped, with Play Store and App Store links: EzySplit, FitPrep and more, under Techtiten.",
  alternates: { canonical: "/apps" },
  openGraph: {
    title: "Apps by Arun Kumar · Techtiten",
    description: "Every app I've built, with store links. One tap to try them.",
    url: "/apps",
  },
};

export const revalidate = 300;

const onStore = (p: Project) => Boolean(p.links.playStore || p.links.appStore);

/** A real picture for the tile (screenshot or uploaded cover), never the old mock graphics. */
function thumbOf(p: Project): string | null {
  const shot = (p.screenshots ?? []).find(Boolean);
  if (shot) return shot;
  if (p.image && !p.image.startsWith("/projects/mock")) return p.image;
  return null;
}

function AppCard({ project }: { project: Project }) {
  const thumb = thumbOf(project);
  const site = liveSite(project);
  const { playStore, appStore, github } = project.links;
  return (
    <article className="flex gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-colors hover:border-mint/60">
      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl border border-border bg-bg-raised">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element -- uploaded screenshots (ImageKit), not build-time assets
          <img src={thumb} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
        ) : (
          <div className="grid h-full w-full place-items-center font-display text-2xl font-bold text-mint">
            {project.title.charAt(0)}
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h2 className="font-display text-lg font-bold leading-tight text-ink">{project.title}</h2>
          <Link
            href={`/portfolio/${project.slug}`}
            className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold text-ink-faint hover:text-mint"
          >
            Details <ArrowUpRight size={12} />
          </Link>
        </div>
        <p className="mono-label mt-1 text-[10.5px] text-ink-faint">{project.status}</p>
        <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{project.tagline || project.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {playStore ? (
            <a href={playStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-mint px-3.5 py-1.5 text-xs font-bold text-bg">
              <FaGooglePlay size={12} /> Google Play
            </a>
          ) : null}
          {appStore ? (
            <a href={appStore} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-1.5 text-xs font-bold text-bg">
              <FaApple size={13} /> App Store
            </a>
          ) : null}
          {site ? (
            <a href={site} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-ink-soft hover:text-mint">
              <FaGlobe size={12} /> Website
            </a>
          ) : null}
          {github ? (
            <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-3.5 py-1.5 text-xs font-semibold text-ink-soft hover:text-mint">
              <FaGithub size={12} /> Source
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default async function AppsPage() {
  const projects = await getProjectsForBuild();
  const live = projects.filter(onStore);
  const more = projects.filter((p) => !onStore(p));
  const linkedin = socials.find((s) => s.label === "LinkedIn")?.href;
  const github = socials.find((s) => s.label === "GitHub")?.href;

  return (
    <div className="mx-auto max-w-xl px-5 py-14">
      <Reveal>
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element -- small static avatar */}
          <img src="/images/self.jpeg" alt={brand.founder} className="h-20 w-20 rounded-full border-2 border-mint/60 object-cover" />
          <h1 className="mt-4 font-display text-3xl font-bold text-ink">Apps by {brand.founder}</h1>
          <p className="mt-2 text-sm text-ink-soft">
            {brand.founderRoles.join(" · ")} · {brand.city}. Built and shipped under Techtiten. Tap an app to try it.
          </p>
        </div>
      </Reveal>

      {live.length ? (
        <section className="mt-10">
          <p className="mono-label mb-3 text-xs text-mint">On the stores</p>
          <div className="grid gap-3">
            {live.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 4) * 0.05}>
                <AppCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {more.length ? (
        <section className="mt-10">
          <p className="mono-label mb-3 text-xs text-mint">More I&apos;ve built</p>
          <div className="grid gap-3">
            {more.map((p, i) => (
              <Reveal key={p.slug} delay={Math.min(i, 4) * 0.05}>
                <AppCard project={p} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap justify-center gap-3 text-sm">
        <Link href="/portfolio" className="rounded-full border border-border px-4 py-2 font-semibold text-ink-soft hover:text-mint">Full portfolio</Link>
        <Link href="/blog" className="rounded-full border border-border px-4 py-2 font-semibold text-ink-soft hover:text-mint">Blog</Link>
        {linkedin ? (
          <a href={linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-semibold text-ink-soft hover:text-mint">
            <FaLinkedin size={14} /> LinkedIn
          </a>
        ) : null}
        {github ? (
          <a href={github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 font-semibold text-ink-soft hover:text-mint">
            <FaGithub size={14} /> GitHub
          </a>
        ) : null}
        <a href={`mailto:${brand.email}`} className="rounded-full border border-border px-4 py-2 font-semibold text-ink-soft hover:text-mint">Email me</a>
      </div>
    </div>
  );
}
