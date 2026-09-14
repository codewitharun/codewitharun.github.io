"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { ProjectDoc } from "@/lib/projects";

type ProjectListProps = {
  projects: ProjectDoc[];
  onEdit: (project: ProjectDoc) => void;
  onDelete: (project: ProjectDoc) => void;
};

export default function ProjectList({ projects, onEdit, onDelete }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-ink-soft">
          No projects yet — import the starter set above, or add your first one.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-soft rounded-2xl border border-border bg-bg-card">
      {projects.map((project) => (
        <div key={project.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-display text-sm font-bold text-ink">{project.title}</p>
              {project.currentlyWorkingOn && (
                <span className="mono-label shrink-0 rounded-full bg-mint px-2 py-0.5 text-[10px] text-bg">
                  Currently working on
                </span>
              )}
              <span
                className={`mono-label shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                  project.published
                    ? "bg-mint/15 text-mint"
                    : "bg-ink-faint/15 text-ink-faint"
                }`}
              >
                {project.published ? "published" : "hidden"}
              </span>
            </div>
            <p className="truncate text-xs text-ink-faint">/portfolio/{project.slug}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onEdit(project)}
              className="text-ink-faint transition-colors hover:text-mint"
              aria-label={`Edit ${project.title}`}
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(project)}
              className="text-ink-faint transition-colors hover:text-red-400"
              aria-label={`Delete ${project.title}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
