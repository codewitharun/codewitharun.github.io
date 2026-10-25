// Which app a blog post is about, so case studies can list their posts and
// each post can end with a card for its app.
//
// Only what's picked in /admin counts (the post's `relatedProject`, a
// project slug). The editor may show a suggestion (below), but nothing is
// linked until the author picks it: a post can mention an app in passing.

import type { Project } from "@/data/site";
import { projectBySlug, projects } from "@/content/projects";

type PostLike = { relatedProject?: string };

/** The app a post is about, or null when none was picked. */
export function projectForPost(post: PostLike): Project | null {
  const pick = (post.relatedProject ?? "").trim();
  if (!pick || pick === "none") return null;
  return projectBySlug(pick) ?? null;
}

/** Posts about one app, in the order given (newest first from the caller). */
export function postsForProject<T extends PostLike>(posts: T[], slug: string): T[] {
  return posts.filter((post) => projectForPost(post)?.slug === slug);
}

function hostOf(url: string): string {
  try {
    return new URL(url).host.replace(/^www\./, "");
  } catch {
    return "";
  }
}

/**
 * A hint for the admin editor only, never applied on its own: the app this
 * post looks like it's about, from its title/slug first, then from links to
 * the app's site or store listing in the body. The author still picks.
 */
export function suggestProjectForPost(post: {
  title?: string;
  slug?: string;
  content?: string;
}): Project | null {
  const head = `${post.title ?? ""} ${(post.slug ?? "").replace(/-/g, " ")}`.toLowerCase();
  const byName = projects.filter((p) =>
    new RegExp(`\\b${p.title.toLowerCase().replace(/[^a-z0-9 ]/g, "")}\\b`).test(head),
  );
  if (byName.length === 1) return byName[0];

  const body = post.content ?? "";
  const byLink = projects.filter((p) => {
    const ids = [p.links.website && hostOf(p.links.website), p.links.playStore, p.links.appStore]
      .filter(Boolean)
      .map((s) => (s as string).split("?id=")[1] ?? s);
    return ids.some((id) => id && body.includes(id as string));
  });
  return byLink.length === 1 ? byLink[0] : null;
}
