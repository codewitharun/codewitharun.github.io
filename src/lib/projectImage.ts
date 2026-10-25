import type { Project, ProjectPlatform } from "@/data/site";

// What to draw for a project. Everything comes from files in
// public/projects/<slug>/ listed in src/content/projects.ts. There are no
// live website screenshots any more: they broke whenever a site was slow
// or down, and could show the wrong page.

export function platformOf(project: Project): ProjectPlatform {
  if (project.platform) return project.platform;
  const app = Boolean(project.links.playStore || project.links.appStore);
  const web = Boolean(project.links.website);
  if (app && web) return "both";
  if (web) return "web";
  return "mobile";
}

export type Showcase =
  | { kind: "phones"; shots: string[] } // plain app screens in 1-3 iPhone frames
  | { kind: "cover"; src: string } // a composed graphic, drawn flat
  | { kind: "web-phone"; web: string; phone: string } // web screenshot + the app on a phone
  | { kind: "tile" }; // nothing to show: a clean title tile

export function getShowcase(project: Project): Showcase {
  const shots = (project.screenshots ?? []).filter(Boolean);
  // web + mobile from one codebase: the site with the app's phone over it
  if (project.cover && shots.length && platformOf(project) === "both") {
    return { kind: "web-phone", web: project.cover, phone: shots[0] };
  }
  if (shots.length) return { kind: "phones", shots: shots.slice(0, 3) };
  if (project.cover) return { kind: "cover", src: project.cover };
  return { kind: "tile" };
}
