import { siteUrl } from "@/data/site";
import { getPublishedPosts } from "@/lib/posts";
import { getProjectsForBuild } from "@/lib/projects";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/about", "/portfolio", "/blog"];
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency:
      route === "" || route === "/portfolio" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/portfolio" ? 0.9 : 0.7,
  }));

  // getProjectsForBuild already falls back to the static project list on
  // its own if Firestore is unreachable, so this never needs a try/catch.
  const projects = await getProjectsForBuild();
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    lastModified: new Date(project.updatedAt || Date.now()),
    changeFrequency: "monthly",
    priority: project.currentlyWorkingOn ? 0.8 : 0.6,
  }));

  // Best-effort: if Firestore is unreachable at build time (rules not
  // deployed yet, no network), fall back to just the static + project
  // routes rather than failing the whole build.
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    postEntries = posts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: "monthly",
      priority: 0.6,
    }));
  } catch {
    postEntries = [];
  }

  return [...staticEntries, ...projectEntries, ...postEntries];
}
