"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

// Nav lives in the root layout, which Next.js statically prerenders once
// and reuses across every route (that's what makes shared layouts fast).
// Because of that, usePathname()'s value baked into the static HTML for
// a hard/direct page load doesn't reliably reflect the actual route —
// verified on the live site: hitting https://techtiten.com/ directly
// always rendered every nav link (including Home) as inactive, even
// though clicking between pages client-side highlighted the right one
// correctly every time. window.location.pathname is always accurate the
// moment the component mounts, regardless of what the static shell
// assumed, so it's used to set the true initial value; the effect
// re-reads it whenever usePathname()'s value changes too, so real
// client-side navigations (which do update correctly) keep working.
function useActivePathname() {
  const routerPathname = usePathname();
  const [pathname, setPathname] = useState<string | null>(null);

  useEffect(() => {
    setPathname(window.location.pathname);
  }, [routerPathname]);

  return pathname;
}

export default function Nav() {
  const pathname = useActivePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border-soft/80 bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center" aria-label="Techtiten home">
          {/* Plain <img>, not next/image — this SVG is already vector/tiny
              (see README's imaging section), so there's nothing the image
              optimizer would meaningfully improve, and it sidesteps
              next/image's extra config needed to serve SVGs at all. */}
          <img src="/images/techtiten-logo.svg" alt="Techtiten" className="h-8 w-auto" />
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`mono-label text-xs transition-colors ${
                  active ? "text-mint" : "text-ink-faint hover:text-ink"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href="/#contact"
            className="rounded-full bg-mint px-4 py-2 text-xs font-semibold text-bg transition-transform hover:scale-105"
          >
            Hire Me
          </Link>
        </nav>

        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          className="text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-border-soft px-6 py-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="mono-label py-2 text-xs text-ink-soft hover:text-mint"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-full bg-mint px-4 py-2 text-center text-xs font-semibold text-bg"
          >
            Hire Me
          </Link>
        </nav>
      )}
    </header>
  );
}
