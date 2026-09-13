import type { Metadata } from "next";
import Image from "next/image";
import Reveal from "@/components/Reveal";
import { bio, brand, hobbies, skills } from "@/data/site";

export const metadata: Metadata = {
  title: "About Arun Kumar — React Native Developer & Software Engineer",
  description:
    "Arun Kumar, the React Native developer and software engineer behind Techtiten (Tech Titan) — based in Jaipur, India. Background, skills, and what's next.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-20">
      <Reveal>
        <p className="mono-label mb-3 text-xs text-mint">About</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">
          The person behind Tech<span className="text-gradient">titen</span>
        </h1>
      </Reveal>

      <Reveal delay={0.1} className="mt-10 flex flex-col gap-10 md:flex-row">
        <div className="relative mx-auto h-40 w-40 shrink-0 overflow-hidden rounded-2xl border border-border md:mx-0">
          <Image src="/images/self.png" alt={brand.founder} fill className="object-cover" />
        </div>
        <div className="space-y-4 text-ink-soft">
          {bio.split("\n\n").map((para) => (
            <p key={para.slice(0, 24)}>{para}</p>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.15} className="mt-16">
        <p className="mono-label mb-4 text-xs text-violet">$ ls skills --proficient</p>
        <div className="flex flex-wrap gap-2">
          {skills.proficientWith.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border bg-bg-card px-3 py-1.5 text-sm text-ink-soft"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.2} className="mt-12">
        <p className="mono-label mb-4 text-xs text-violet">$ ls skills --currently-learning</p>
        <div className="flex flex-wrap gap-2">
          {skills.learning.map((s) => (
            <span
              key={s}
              className="rounded-full border border-border-soft px-3 py-1.5 text-sm text-ink-faint"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.25} className="mt-12">
        <p className="mono-label mb-4 text-xs text-violet">$ cd hobbies &amp;&amp; ls</p>
        <div className="flex flex-wrap gap-4">
          {hobbies.map((h) => (
            <span
              key={h.label}
              className="flex items-center gap-2 rounded-xl border border-border bg-bg-card px-4 py-3 text-sm text-ink-soft"
            >
              <span className="text-lg">{h.emoji}</span> {h.label}
            </span>
          ))}
        </div>
      </Reveal>
    </div>
  );
}
