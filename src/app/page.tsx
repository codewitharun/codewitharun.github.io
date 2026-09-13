import ProjectLinkButtons from "@/components/ProjectLinkButtons";
import ProjectMedia from "@/components/ProjectMedia";
import Reveal from "@/components/Reveal";
import TitanShape from "@/components/three/TitanShape";
import { brand, miniBio, projects } from "@/data/site";
import { ArrowUpRight, FileDown, Mail } from "lucide-react";
import Link from "next/link";

const flagship = projects.find((p) => p.featured) ?? projects[0];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-6 pt-16 pb-20 md:grid-cols-2 md:pt-24 md:pb-28">
          <Reveal>
            <p className="mono-label mb-4 text-xs text-mint">{brand.tagline}</p>
            <h1 className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Tech<span className="text-gradient">titen</span>
            </h1>
            <p className="mt-3 max-w-md text-sm font-medium text-ink-soft">
              {brand.founder} · {brand.founderRoles.join(" & ")} ·{" "}
              {brand.location}
            </p>
            <p className="mt-5 max-w-md text-lg text-ink-soft">
              {brand.longTagline} A titan intentionally spelled wrong, standing
              in for a studio that ships while still figuring it out. Built by{" "}
              {brand.founder}, a {brand.founderRoles[0].toLowerCase()} and{" "}
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
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint to-violet px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105"
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

      {/* Flagship project */}
      <section className="border-t border-border-soft/60 bg-bg-raised/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <Reveal>
            <p className="mono-label mb-3 text-xs text-violet">
              Flagship product
            </p>
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2">
              <div>
                <h2 className="font-display text-3xl font-bold text-ink">
                  {flagship.title}
                </h2>
                <p className="mt-4 text-ink-soft">{flagship.description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {flagship.tech.map((t) => (
                    <span
                      key={t}
                      className="mono-label rounded-full border border-border px-3 py-1 text-[10px] text-ink-faint"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <ProjectLinkButtons
                  links={flagship.links}
                  className="mt-6 flex flex-wrap gap-5"
                />
              </div>
              <ProjectMedia
                project={flagship}
                className="relative overflow-hidden rounded-2xl border border-border shadow-[0_0_60px_-15px_rgba(166,104,255,0.35)]"
              />
            </div>
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
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint to-violet px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105"
              >
                <Mail size={16} /> {brand.email}
              </Link>
              <Link
                href={brand.resumeUrl}
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-mint hover:text-mint"
              >
                <FileDown size={16} /> Resume
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
