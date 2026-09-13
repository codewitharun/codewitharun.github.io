"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import Reveal from "@/components/Reveal";
import type { Post } from "@/lib/posts";

const PAGE_SIZE = 6;

export default function BlogList({ posts }: { posts: Post[] }) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (post) => post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q)
    );
  }, [posts, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function handleSearchChange(value: string) {
    setQuery(value);
    setPage(1); // a new search always starts back at page 1
  }

  function goToPage(n: number) {
    setPage(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <Reveal delay={0.05} className="relative mt-10">
        <Search
          size={16}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search posts…"
          aria-label="Search posts"
          className="w-full rounded-full border border-border bg-bg-card py-3 pl-11 pr-4 text-sm text-ink outline-none transition-colors focus:border-mint/60"
        />
      </Reveal>

      {filtered.length === 0 ? (
        <div className="mt-14 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="mono-label text-xs text-ink-faint">$ ls posts --grep &quot;{query}&quot;</p>
          <p className="mt-3 text-ink-soft">No posts match that search.</p>
        </div>
      ) : (
        <>
          <div className="mt-8 space-y-6">
            {pagePosts.map((post, i) => (
              <Reveal key={post.id} delay={(i % PAGE_SIZE) * 0.05}>
                <Link href={`/blog/${post.slug}`} className="block">
                  <article className="flex items-center gap-5 rounded-2xl border border-border bg-bg-card p-6 transition-colors hover:border-mint/60">
                    <div className="min-w-0 flex-1">
                      <h2 className="break-words font-display text-xl font-bold text-ink">
                        {post.title}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm text-ink-soft">{post.excerpt}</p>
                      <p className="mono-label mt-3 text-[11px] text-ink-faint">
                        {new Date(post.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    {post.coverImage && (
                      // eslint-disable-next-line @next/next/no-img-element -- external ImageKit URL
                      <img
                        src={post.coverImage}
                        alt=""
                        className="hidden h-24 w-36 shrink-0 rounded-xl border border-border object-cover sm:block md:h-28 md:w-44"
                      />
                    )}
                  </article>
                </Link>
              </Reveal>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Blog pagination"
              className="mt-10 flex items-center justify-center gap-1.5"
            >
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => goToPage(currentPage - 1)}
                aria-label="Previous page"
                className="rounded-lg border border-border p-2 text-ink-soft transition-colors hover:border-mint hover:text-mint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-soft"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => goToPage(n)}
                  aria-current={n === currentPage ? "page" : undefined}
                  className={`min-w-9 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
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
                onClick={() => goToPage(currentPage + 1)}
                aria-label="Next page"
                className="rounded-lg border border-border p-2 text-ink-soft transition-colors hover:border-mint hover:text-mint disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink-soft"
              >
                <ChevronRight size={16} />
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
}
