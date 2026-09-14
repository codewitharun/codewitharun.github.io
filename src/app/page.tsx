import BrandIcon from "@/components/BrandIcon";
import ContactForm from "@/components/ContactForm";
import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import ProjectMedia from "@/components/ProjectMedia";
import Reveal from "@/components/Reveal";
import TitanShape from "@/components/three/TitanShapeLazy";
import { brand, miniBio } from "@/data/site";
import { getProjectsForBuild } from "@/lib/projects";
import { ArrowUpRight, FileDown, Mail } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa6";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Revalidated periodically (rather than fully static) so edits made in
// /admin — adding, editing, or reordering projects — show up on the home
// page without a redeploy.
export const revalidate = 300;

export default async function Home() {
  const projects = await getProjectsForBuild();
  const current = projects.find((p) => p.currentlyWorkingOn) ?? projects[0];
  const others = projects.filter((p) => p.slug !== current.slug).slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-16 pb-20 md:grid-cols-2 md:pt-24 md:pb-28">
          <Reveal>
            <p className="mono-label mb-4 text-xs text-mint">
              {brand.name} · {brand.founder}
            </p>
            {/* The wordmark now lives in the header logo, so the hero's
                giant headline carries the studio's actual pitch (the
                motto) instead of just repeating the brand name a second
                time right below it. */}
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Not perfect.
              <br />
              <span className="text-gradient">Building anyway.</span>
            </h1>
            <p className="mt-3 max-w-md text-sm font-medium text-ink-soft">
              {brand.founder} · {brand.founderRoles.join(" & ")} ·{" "}
              {brand.location}
            </p>
            <p className="mt-5 max-w-md text-lg text-ink-soft">
              {brand.longTagline} Built by {brand.founder}, a{" "}
              {brand.founderRoles[0].toLowerCase()} and{" "}
              {brand.founderRoles[1].toLowerCase()} working out of{" "}
              {brand.location}.
            </p>

            <ul className="mt-8 space-y-2">
              {miniBio.map((line) => (
                <li
                  key={line.text}
                  className="flex items-center gap-3 text-sm text-ink-soft"
                >
                  <span className="text-base">{line.emoji}</span>
                  {line.text}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105"
              >
                Hire Me <ArrowUpRight size={16} />
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-mint hover:text-mint"
              >
                See the work
              </Link>
            </div>
          </Reveal>

          <Reveal delay={0.15} className="relative h-[340px] md:h-[440px]">
            <TitanShape />
          </Reveal>
        </div>
      </section>

      {/* About the studio — genuine prose, not just a tagline, so the
          home page has actual depth for both readers and search engines.
          The icon fills what was previously dead space beside a fairly
          short, narrow text block on wide viewports. */}
      <section className="border-t border-border-soft/60">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <Reveal>
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[auto_1fr]">
              <BrandIcon className="hidden h-32 w-32 shrink-0 opacity-90 md:block lg:h-40 lg:w-40" />
              <div>
                <p className="mono-label mb-3 text-xs text-mint">
                  About the studio
                </p>
                <p className="max-w-2xl text-ink-soft">
                  Techtiten isn&apos;t a company in the traditional sense —
                  it&apos;s the name for everything{" "}
                  {brand.founder.split(" ")[0]} ships outside a day job. Some of
                  it is polished and already live on the App Store and Play
                  Store; some of it is a half-working idea shipped anyway,
                  because waiting for perfect is how most side projects die
                  quietly in a drafts folder instead. The throughline across all
                  of it is React Native, TypeScript, and Firebase — the same
                  stack behind production apps built for clients like Federal
                  Bank and Ageas Federal, now turned toward personal products,
                  freelance work, and the occasional experiment that may or may
                  not go anywhere.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Currently working on */}
      <section className="border-t border-border-soft/60 bg-bg-raised/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="mono-label mb-3 text-xs text-violet">
              Currently working on
            </p>
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">
                  {current.title}
                </h2>
                <p className="mt-4 text-ink-soft">{current.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {current.tech.map((t) => (
                    <span
                      key={t}
                      className="mono-label rounded-full border border-border px-3 py-1 text-[10px] text-ink-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <Link
                    href={`/portfolio/${current.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint hover:underline"
                  >
                    View case study <ArrowUpRight size={15} />
                  </Link>
                  <ProjectLinkButtons
                    links={current.links}
                    className="flex flex-wrap gap-5"
                  />
                </div>
              </div>
              <ProjectMedia
                project={current}
                className="relative overflow-hidden rounded-2xl border border-border shadow-[0_0_60px_-15px_rgba(166,104,255,0.35)]"
              />
            </div>

            {others.length > 0 && (
              <div className="mt-14 border-t border-border-soft/60 pt-8">
                <p className="mono-label mb-4 text-xs text-ink-faint">
                  Also shipped under Techtiten
                </p>
                <ul className="flex flex-wrap gap-3">
                  {others.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="inline-flex items-center rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-mint hover:text-mint"
                      >
                        {project.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* Contact / Hire Me */}
      <section id="contact" className="border-t border-border-soft/60">
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <Reveal>
            <p className="mono-label mb-3 text-xs text-mint">Get in touch</p>
            <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
              Building something? Let&apos;s talk.
            </h2>
            <p className="mt-4 text-ink-soft">
              Open to full-time roles, consulting, and interesting problems in
              React Native, TypeScript, and Firebase.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href={`mailto:${brand.email}`}
                className="inline-flex items-center gap-2 rounded-full bg-mint px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105"
              >
                <Mail size={16} /> {brand.email}
              </Link>
              <Link
                href={brand.resumeUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-mint hover:text-mint hover:scale-105"
              >
                <FileDown size={16} /> Resume
              </Link>
              <Link
                href="https://wa.me/918601279944"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full bg-mint border border-border px-6 py-3 text-sm font-semibold text-bg transition-colors hover:scale-105"
              >
                <FaWhatsapp size={16} /> Whatsapp
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-4 text-ink-faint">
              <span className="h-px flex-1 bg-border-soft" />
              <span className="mono-label text-xs">Or send a message</span>
              <span className="h-px flex-1 bg-border-soft" />
            </div>

            <div className="mt-8 rounded-2xl border border-border bg-bg-card p-6 md:p-8">
              <ContactForm />
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
