import type { Project } from "@/data/site";

// Live preview screenshots via Microlink's public screenshot API — no API
// key, no build step: the browser just requests this URL like any other
// image and Microlink renders + caches the target page server-side. Free
// tier is rate-limited, so this is meant for a low-traffic portfolio site,
// not something to point at a high-traffic page. `embed=screenshot.url`
// tells it to redirect straight to the image bytes instead of returning
// JSON, so it drops into a plain <img src> unchanged.
function buildScreenshotUrl(targetUrl: string): string {
  const params = new URLSearchParams({
    url: targetUrl,
    screenshot: "true",
    meta: "false",
    embed: "screenshot.url",
    colorScheme: "dark",
    "viewport.width": "1440",
    "viewport.height": "900",
  });
  return `https://api.microlink.io/?${params.toString()}`;
}

export type ProjectImage = {
  src: string;
  /**
   * True when `src` is a live, flat screenshot of just the project's own
   * page — the case DeviceFrame's CSS laptop/phone mockup is meant for.
   * False for the hand-picked `/projects/mockN.png` fallbacks, which are
   * themselves pre-composited "laptop + phone" mockup graphics (built for
   * the old site) — wrapping one of those in a *second* device frame just
   * crops a device-shaped sliver out of an already-framed picture, so
   * those render as a plain flat image instead.
   */
  isLive: boolean;
};

/**
 * Prefer a live screenshot of the project's own site when we have one to
 * point at (`links.website`); fall back to the hand-picked mock image
 * otherwise (Play Store / App Store listings and private repos don't have
 * a public page worth screenshotting).
 */
export function getProjectImage(project: Project): ProjectImage {
  if (project.links.website) {
    return { src: buildScreenshotUrl(project.links.website), isLive: true };
  }
  return { src: project.image, isLive: false };
}
