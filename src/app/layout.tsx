import type { Metadata } from "next";
import { Suspense } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { siteJsonLd } from "@/lib/schema";
import { brand, siteUrl, seoKeywords } from "@/data/site";
// Self-hosted fonts via @fontsource (npm packages), not next/font/google —
// that fetches from fonts.googleapis.com at build time, which isn't
// guaranteed to be reachable on every network this gets built on.
import "@fontsource/sora/500.css";
import "@fontsource/sora/600.css";
import "@fontsource/sora/700.css";
import "@fontsource/sora/800.css";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    // Kept short enough not to truncate in search results (~60 chars is
    // the rough budget) — location and the rest of the pitch still live
    // in the description below, which has more room.
    default: "Techtiten — Arun Kumar, React Native Developer & Software Engineer",
    template: "%s · Techtiten",
  },
  description:
    "Techtiten (also written Tech Titan) is the software studio of Arun Kumar — a React Native developer and software engineer based in Jaipur, India. React Native apps, tools, and experiments, including EzySplit — built imperfect and shipped anyway.",
  keywords: seoKeywords,
  authors: [{ name: brand.founder, url: siteUrl }],
  creator: brand.founder,
  publisher: brand.name,
  alternates: {
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Techtiten",
    title: "Techtiten — Arun Kumar, React Native Developer & Software Engineer",
    description:
      "Arun Kumar — React Native Developer & Software Engineer from Jaipur, India — building under the Techtiten name. Not perfect. Building anyway.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@arunk4it",
    creator: "@arunk4it",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* Firebase Analytics lazy-loads gtag.js from this origin; ImageKit
            serves every uploaded post/project image from ik.imagekit.io.
            Warming up the connection (DNS + TLS) ahead of the actual
            request shaves the round-trip off whichever of these ends up
            mattering for that page — a Lighthouse "Preconnect to required
            origins" fix. */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://ik.imagekit.io" crossOrigin="anonymous" />
      </head>
      <body className="flex min-h-full flex-col bg-bg text-ink">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd()) }}
        />
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
