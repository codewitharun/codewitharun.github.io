"use client";

import { Pencil, Trash2 } from "lucide-react";
import type { Post } from "@/lib/posts";

type PostListProps = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
};

export default function PostList({ posts, onEdit, onDelete }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-ink-soft">No posts yet — create your first one above.</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-soft rounded-2xl border border-border bg-bg-card">
      {posts.map((post) => (
        <div key={post.id} className="flex items-center justify-between gap-4 p-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate font-display text-sm font-bold text-ink">{post.title}</p>
              <span
                className={`mono-label shrink-0 rounded-full px-2 py-0.5 text-[10px] ${
                  post.status === "published"
                    ? "bg-mint/15 text-mint"
                    : "bg-ink-faint/15 text-ink-faint"
                }`}
              >
                {post.status}
              </span>
            </div>
            <p className="truncate text-xs text-ink-faint">/blog/{post.slug}</p>
          </div>
          <div className="flex shrink-0 items-center gap-3">
            <button
              type="button"
              onClick={() => onEdit(post)}
              className="text-ink-faint transition-colors hover:text-mint"
              aria-label={`Edit ${post.title}`}
            >
              <Pencil size={16} />
            </button>
            <button
              type="button"
              onClick={() => onDelete(post)}
              className="text-ink-faint transition-colors hover:text-red-400"
              aria-label={`Delete ${post.title}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
