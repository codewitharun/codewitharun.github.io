// Which app a blog post is about, so case studies can list their posts and
// each post can end with a card for its app.
//
// A post's `relatedProject` (set in /admin) wins: a project slug, or "none".
// Left on "Automatic" (""), it's worked out from the post itself:
//   1. its title names the app, or
//   2. its text links to the app's case study (/portfolio/<slug>) or its
//      store listing (Play / App Store URL).
// The title wins (a FitPrep post may link to EzySplit in passing), and the
// first match in display order wins.
import type { Project } from "@/data/site";
import { projectBySlug, projects } from "@/content/projects";

type PostLike = { title: string; content: string; relatedProject?: string };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function linksTo(content: string, p: Project): boolean {
  const text = content.toLowerCase();
  if (text.includes(`/portfolio/${p.slug}`)) return true;
  const stores = [p.links.playStore, p.links.appStore].filter(Boolean) as string[];
  return stores.some((url) => text.includes(url.toLowerCase().replace(/^https?:\/\//, "")));
}

function namedIn(title: string, p: Project): boolean {
  return new RegExp(`(^|[^a-z0-9])${escape(p.title.toLowerCase())}([^a-z0-9]|$)`).test(title.toLowerCase());
}

/** What "Automatic" picks for a post (ignores relatedProject). */
export function autoProjectForPost(post: Pick<PostLike, "title" | "content">): Project | null {
  return (
    projects.find((p) => namedIn(post.title ?? "", p)) ??
    projects.find((p) => linksTo(post.content ?? "", p)) ??
    null
  );
}

/** The app a post is about, honouring the admin's choice. */
export function projectForPost(post: PostLike): Project | null {
  const pick = (post.relatedProject ?? "").trim();
  if (pick === "none") return null;
  if (pick) return projectBySlug(pick) ?? null;
  return autoProjectForPost(post);
}

/** Posts about one app, in the order given (newest first from the caller). */
export function postsForProject<T extends PostLike>(posts: T[], slug: string): T[] {
  return posts.filter((post) => projectForPost(post)?.slug === slug);
}
