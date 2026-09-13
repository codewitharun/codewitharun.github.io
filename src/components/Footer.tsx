import Link from "next/link";
import { socials, brand } from "@/data/site";

export default function Footer() {
  return (
    <footer className="border-t border-border-soft/80 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 text-center">
        <p className="font-display text-sm font-semibold text-ink">
          Tech<span className="text-gradient">titen</span>
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {socials.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mono-label text-xs text-ink-faint transition-colors hover:text-mint"
            >
              {s.label}
            </Link>
          ))}
        </div>
        <p className="text-xs text-ink-faint">
          Built by {brand.founder} · {brand.location} · © {new Date().getFullYear()}
        </p>
      </div>
    </footer>
  );
}
