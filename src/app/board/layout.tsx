import type { Metadata, Viewport } from "next";

// Private wallpaper board: never indexed, never in the sitemap.
export const metadata: Metadata = {
  title: "Board",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#08080d",
  viewportFit: "cover",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
