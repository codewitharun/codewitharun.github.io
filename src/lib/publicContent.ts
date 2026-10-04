// src/lib/publicContent.ts
// SERVER-side reads for the public pages (/, /blog, /blog/[slug],
// /portfolio, /portfolio/[slug], sitemap, RSS).
//
// Why this exists: those pages used to read through the Firestore *client*
// SDK (posts.ts / projects.ts). On a long-running Next server that SDK
// keeps one live connection and a local cache; when the connection drops
// it quietly answers from its stale cache (so a just-published post isn't
// found -> 404) or errors (-> 500) until the server restarts. Exactly the
// "new post fails until I restart" bug.
//
// Here every read is a plain, stateless HTTPS call to Firestore's REST
// API, cached by Next (unstable_cache) for 5 minutes and tagged so the
// admin's save -> /api/revalidate expires it immediately.
//
// The queries filter on status/published so they satisfy firestore.rules
// for anonymous readers (posts: status == "published"; projects:
// published == true). Sorting happens here, so no composite index needed.
// The admin panel keeps using posts.ts / projects.ts in the browser.
import { unstable_cache } from "next/cache";
import { fallbackProjects } from "@/data/site";
import { firebaseConfig } from "@/lib/firebaseConfig";
import type { Post } from "@/lib/posts";
import type { ProjectDoc } from "@/lib/projects";

export const POSTS_TAG = "posts";
export const PROJECTS_TAG = "projects";
const REVALIDATE_SECONDS = 300;

const RUN_QUERY_URL = `https://firestore.googleapis.com/v1/projects/${firebaseConfig.projectId}/databases/(default)/documents:runQuery?key=${firebaseConfig.apiKey}`;

// ---- Firestore REST value decoding ------------------------------------------

type RestValue = {
  nullValue?: null;
  booleanValue?: boolean;
  integerValue?: string;
  doubleValue?: number;
  stringValue?: string;
  timestampValue?: string;
  arrayValue?: { values?: RestValue[] };
  mapValue?: { fields?: Record<string, RestValue> };
  referenceValue?: string;
  geoPointValue?: unknown;
  bytesValue?: string;
};

export function decodeValue(v: RestValue | undefined): unknown {
  if (!v) return undefined;
  if ("stringValue" in v) return v.stringValue;
  if ("booleanValue" in v) return v.booleanValue;
  if ("integerValue" in v) return Number(v.integerValue);
  if ("doubleValue" in v) return v.doubleValue;
  // Timestamps become epoch ms - the same shape posts.ts/projects.ts expose.
  if ("timestampValue" in v) return Date.parse(v.timestampValue!);
  if ("nullValue" in v) return null;
  if ("arrayValue" in v) return (v.arrayValue?.values ?? []).map(decodeValue);
  if ("mapValue" in v) return decodeFields(v.mapValue?.fields ?? {});
  if ("referenceValue" in v) return v.referenceValue;
  return undefined;
}

export function decodeFields(fields: Record<string, RestValue>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(fields).map(([k, v]) => [k, decodeValue(v)]));
}

type RunQueryRow = { document?: { name: string; fields?: Record<string, RestValue> } };

/** Documents in `collectionId` where `field == value`, as plain objects with `id`. */
async function queryWhereEquals(
  collectionId: string,
  field: string,
  value: RestValue,
): Promise<Record<string, unknown>[]> {
  const res = await fetch(RUN_QUERY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      structuredQuery: {
        from: [{ collectionId }],
        where: { fieldFilter: { field: { fieldPath: field }, op: "EQUAL", value } },
      },
    }),
    // Caching is handled by unstable_cache below, not the fetch cache.
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Firestore ${collectionId} query failed: ${res.status} ${await res.text()}`);
  }
  const rows = (await res.json()) as RunQueryRow[];
  return rows
    .filter((r) => r.document)
    .map((r) => ({
      id: r.document!.name.split("/").pop()!,
      ...decodeFields(r.document!.fields ?? {}),
    }));
}

// ---- Posts --------------------------------------------------------------------

export function toPost(d: Record<string, unknown>): Post {
  return {
    id: String(d.id),
    title: String(d.title ?? ""),
    slug: String(d.slug ?? ""),
    excerpt: String(d.excerpt ?? ""),
    content: String(d.content ?? ""),
    coverImage: (d.coverImage as string | null | undefined) ?? null,
    status: d.status === "published" ? "published" : "draft",
    createdAt: Number(d.createdAt ?? 0) || 0,
    updatedAt: Number(d.updatedAt ?? 0) || 0,
  };
}

/** Published posts, newest first. Throws if Firestore can't be reached. */
export const getPublishedPosts = unstable_cache(
  async (): Promise<Post[]> => {
    const docs = await queryWhereEquals("posts", "status", { stringValue: "published" });
    return docs.map(toPost).sort((a, b) => b.createdAt - a.createdAt);
  },
  ["public-published-posts"],
  { revalidate: REVALIDATE_SECONDS, tags: [POSTS_TAG] },
);

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.slug === slug) ?? null;
}

// ---- Projects -------------------------------------------------------------------

export function toProject(d: Record<string, unknown>): ProjectDoc {
  return {
    id: String(d.id),
    slug: String(d.slug ?? ""),
    title: String(d.title ?? ""),
    description: String(d.description ?? ""),
    links: (d.links as ProjectDoc["links"]) ?? {},
    image: String(d.image ?? ""),
    tech: (d.tech as string[]) ?? [],
    status: String(d.status ?? ""),
    currentlyWorkingOn: Boolean(d.currentlyWorkingOn),
    features: (d.features as string[]) ?? [],
    platform: ["mobile", "web", "both"].includes(String(d.platform))
      ? (d.platform as ProjectDoc["platform"])
      : undefined,
    screenshots: (d.screenshots as string[]) ?? [],
    tagline: String(d.tagline ?? ""),
    role: String(d.role ?? ""),
    year: String(d.year ?? ""),
    highlights: (d.highlights as string[]) ?? [],
    published: d.published !== false,
    order: Number(d.order ?? 0) || 0,
    createdAt: Number(d.createdAt ?? 0) || 0,
    updatedAt: Number(d.updatedAt ?? 0) || 0,
  };
}

const getPublishedProjectsCached = unstable_cache(
  async (): Promise<ProjectDoc[]> => {
    const docs = await queryWhereEquals("projects", "published", { booleanValue: true });
    return docs.map(toProject).sort((a, b) => a.order - b.order);
  },
  ["public-published-projects"],
  { revalidate: REVALIDATE_SECONDS, tags: [PROJECTS_TAG] },
);

function fallbackProjectDocs(): ProjectDoc[] {
  return fallbackProjects.map((project, index) => ({
    ...project,
    id: project.slug,
    published: true,
    order: index,
    createdAt: 0,
    updatedAt: 0,
  }));
}

/**
 * Published projects, falling back to the hardcoded list when Firestore
 * can't be reached or has none yet (same behaviour as before).
 */
export async function getProjectsForBuild(): Promise<ProjectDoc[]> {
  try {
    const projects = await getPublishedProjectsCached();
    return projects.length > 0 ? projects : fallbackProjectDocs();
  } catch (error) {
    console.error("Projects: falling back to the built-in list:", error);
    return fallbackProjectDocs();
  }
}
