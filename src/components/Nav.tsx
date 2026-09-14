"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const pathname = usePathname();
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
            className="rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-xs font-semibold text-bg transition-transform hover:scale-105"
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
            className="mt-2 rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-center text-xs font-semibold text-bg"
          >
            Hire Me
          </Link>
        </nav>
      )}
    </header>
  );
}
