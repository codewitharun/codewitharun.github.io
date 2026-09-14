import { brand, socials } from "@/data/site";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft/80 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <img
          src="/images/techtiten-logo.svg"
          alt="Techtiten"
          className="h-10 w-auto"
        />
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              // rel="me" on GitHub specifically (in addition to the usual
              // noopener/noreferrer) — the IndieWeb identity-verification
              // convention search engines and other services already
              // recognize, reinforcing that this GitHub account and this
              // site are the same entity, on top of the sameAs already
              // set in the JSON-LD.
              rel={
                s.label === "GitHub"
                  ? "me noopener noreferrer"
                  : "noopener noreferrer"
              }
              className="mono-label text-xs text-ink-faint transition-colors hover:text-mint"
            >
              {s.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-ink-faint">
          Built by {brand.founder} · {brand.location} · ©{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
