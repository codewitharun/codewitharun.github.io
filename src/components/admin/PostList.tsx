"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Pencil, Search, Trash2 } from "lucide-react";
import type { Post } from "@/lib/posts";

type PostListProps = {
  posts: Post[];
  onEdit: (post: Post) => void;
  onDelete: (post: Post) => void;
};

const PAGE_SIZE = 8;

export default function PostList({ posts, onEdit, onDelete }: PostListProps) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) => post.title.toLowerCase().includes(q) || post.slug.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  // The full post list (created/deleted elsewhere, or a fresh search) can
  // change page count out from under whatever page was selected — keep the
  // current page valid instead of showing a blank page 4 of 2.
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  if (posts.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-ink-soft">No posts yet — create your first one above.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="relative">
        <Search
          size={15}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
          placeholder="Search posts by title or slug…"
          aria-label="Search posts"
          className="w-full rounded-full border border-border bg-bg px-3 py-2 pl-10 text-sm text-ink outline-none transition-colors focus:border-mint/60"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-soft">No posts match &quot;{query}&quot;.</p>
        </div>
      ) : (
        <>
          <div className="mt-4 divide-y divide-border-soft rounded-2xl border border-border bg-bg-card">
            {pagePosts.map((post) => (
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

          {totalPages > 1 && (
            <nav aria-label="Post list pagination" className="mt-4 flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                aria-label="Previous page"
                className="rounded-lg border border-border p-2 text-ink-soft transition-colors hover:border-mint hover:text-mint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-soft"
              >
                <ChevronLeft size={15} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setPage(n)}
                  aria-current={n === currentPage ? "page" : undefined}
                  className={`min-w-8 rounded-lg border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                    n === currentPage
                      ? "border-mint/60 bg-mint/15 text-mint"
                      : "border-border text-ink-soft hover:border-mint hover:text-mint"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                aria-label="Next page"
                className="rounded-lg border border-border p-2 text-ink-soft transition-colors hover:border-mint hover:text-mint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-soft"
              >
                <ChevronRight size={15} />
              </button>
            </nav>
          )}
        </>
      )}
    </div>
  );
}
