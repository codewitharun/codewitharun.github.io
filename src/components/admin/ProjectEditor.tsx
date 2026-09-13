"use client";

import { useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import {
  createProject,
  updateProject,
  uploadProjectImage,
  resolvePositionAndReorder,
  slugifyProject,
  type ProjectDoc,
  type ProjectInput,
} from "@/lib/projects";
import { revalidatePaths } from "@/lib/revalidate";
import type { ProjectLinks } from "@/data/site";

type ProjectEditorProps = {
  project: ProjectDoc | null; // null = creating a new project
  /** Every project (published or not), sorted by their current order —
   * used to build the position picker and to shift everyone else when
   * this project's position changes. */
  projects: ProjectDoc[];
  onDone: () => void;
  onCancel: () => void;
};

export default function ProjectEditor({ project, projects, onDone, onCancel }: ProjectEditorProps) {
  const [title, setTitle] = useState(project?.title ?? "");
  const [slug, setSlug] = useState(project?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(project));
  const [description, setDescription] = useState(project?.description ?? "");
  const [status, setStatus] = useState(project?.status ?? "In Development");
  const [tech, setTech] = useState((project?.tech ?? []).join(", "));
  const [playStore, setPlayStore] = useState(project?.links.playStore ?? "");
  const [appStore, setAppStore] = useState(project?.links.appStore ?? "");
  const [website, setWebsite] = useState(project?.links.website ?? "");
  const [github, setGithub] = useState(project?.links.github ?? "");
  const [image, setImage] = useState(project?.image ?? "");
  const [currentlyWorkingOn, setCurrentlyWorkingOn] = useState(
    project?.currentlyWorkingOn ?? false
  );
  const [published, setPublished] = useState(project?.published ?? true);

  // `projects` is already sorted by order — everyone except the project
  // being edited (if any), in their current display order.
  const otherProjects = projects.filter((p) => p.id !== project?.id);
  const totalSlots = otherProjects.length + 1;
  const currentPosition = project
    ? projects.findIndex((p) => p.id === project.id) + 1 || totalSlots
    : totalSlots; // new projects default to the end of the list
  const [position, setPosition] = useState(currentPosition);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugifyProject(value));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadProjectImage(slug || slugifyProject(title) || "project", file);
      setImage(url);
    } catch {
      setError("Image upload failed — check Storage rules are deployed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave() {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);

    const links: ProjectLinks = {};
    if (playStore.trim()) links.playStore = playStore.trim();
    if (appStore.trim()) links.appStore = appStore.trim();
    if (website.trim()) links.website = website.trim();
    if (github.trim()) links.github = github.trim();

    try {
      // Resolves the chosen 1-indexed position into a real `order` value
      // and shifts every other project's order (and clears their
      // "currently working on" flag, if this one is being set) to make
      // room — all before this project's own create/update, which is the
      // only write left to make.
      const order = await resolvePositionAndReorder(otherProjects, position, currentlyWorkingOn);

      const input: ProjectInput = {
        title: title.trim(),
        slug: slug.trim(),
        description: description.trim(),
        status: status.trim(),
        tech: tech
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
        links,
        image: image.trim(),
        currentlyWorkingOn,
        published,
        order,
      };

      if (project) {
        await updateProject(project.id, input);
      } else {
        await createProject(input);
      }

      // /portfolio and /portfolio/[slug] are ISR-cached (revalidate = 300)
      // and the homepage shows current work too — without this a save
      // wouldn't appear publicly for up to 5 minutes.
      const pathsToRevalidate = new Set(["/portfolio", `/portfolio/${input.slug}`, "/"]);
      if (project && project.slug !== input.slug) pathsToRevalidate.add(`/portfolio/${project.slug}`);
      revalidatePaths(Array.from(pathsToRevalidate));

      onDone();
    } catch {
      setError("Couldn't save — check Firestore rules are deployed and you're signed in.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-bg-card p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-ink">
          {project ? "Edit project" : "New project"}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="text-ink-faint transition-colors hover:text-ink"
          aria-label="Cancel"
        >
          <X size={18} />
        </button>
      </div>

      <label className="mt-5 block text-xs text-ink-faint">
        Title
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
        />
      </label>

      <label className="mt-4 block text-xs text-ink-faint">
        Slug (techtiten.com/portfolio/…)
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugifyProject(e.target.value));
          }}
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-mint"
        />
      </label>

      <label className="mt-4 block text-xs text-ink-faint">
        Description
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-xs text-ink-faint">
          Status label (shown on the card, e.g. &quot;Live on Play Store&quot;)
          <input
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>
        <label className="block text-xs text-ink-faint">
          Position ({totalSlots} project{totalSlots === 1 ? "" : "s"} total — 1 is shown first)
          <select
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          >
            {Array.from({ length: totalSlots }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} {n === 1 ? "(first)" : n === totalSlots ? "(last)" : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 block text-xs text-ink-faint">
        Tech tags (comma-separated)
        <input
          value={tech}
          onChange={(e) => setTech(e.target.value)}
          placeholder="React Native, TypeScript, Firebase"
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
        />
      </label>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="block text-xs text-ink-faint">
          Play Store link
          <input
            value={playStore}
            onChange={(e) => setPlayStore(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>
        <label className="block text-xs text-ink-faint">
          App Store link
          <input
            value={appStore}
            onChange={(e) => setAppStore(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>
        <label className="block text-xs text-ink-faint">
          Website (also used for a live screenshot, if set)
          <input
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>
        <label className="block text-xs text-ink-faint">
          Source code link
          <input
            value={github}
            onChange={(e) => setGithub(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>
      </div>

      <div className="mt-4">
        <p className="text-xs text-ink-faint">
          Cover image (skipped automatically if a website link is set above — that gets a live
          screenshot instead)
        </p>
        <div className="mt-1.5 flex items-center gap-3">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element -- Storage download URL or a static /projects/*.png path, neither build-time-known
            <img
              src={image}
              alt="Cover"
              className="h-16 w-24 rounded-lg border border-border object-cover"
            />
          )}
          <label
            className={`inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-ink-soft transition-colors ${
              uploading ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:border-mint hover:text-mint"
            }`}
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />}
            {uploading ? "Compressing & uploading…" : image ? "Replace" : "Upload"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={handleImageUpload}
            />
          </label>
          {image && (
            <button
              type="button"
              onClick={() => setImage("")}
              className="text-xs text-ink-faint hover:text-red-400"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={currentlyWorkingOn}
            onChange={(e) => setCurrentlyWorkingOn(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-mint"
          />
          Currently working on this
        </label>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-mint"
          />
          Published (visible on the site)
        </label>
      </div>

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-sm font-semibold text-bg transition-opacity disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save project"}
        </button>
      </div>
    </div>
  );
}
