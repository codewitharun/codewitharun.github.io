import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getPublishedPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on React Native, shipping imperfect things, and building Techtiten.",
  alternates: { canonical: "/blog" },
};

// Revalidate periodically rather than on every request — a personal blog
// doesn't need to be real-time, and this keeps it a static-feeling page.
export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <p className="mono-label mb-3 text-xs text-mint">Blog</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">Notes</h1>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal
          delay={0.1}
          className="mt-14 rounded-2xl border border-dashed border-border p-10 text-center"
        >
          <p className="mono-label text-xs text-ink-faint">$ ls posts</p>
          <p className="mt-3 text-ink-soft">
            Nothing published yet. First post is coming — probably about shipping something
            before it&apos;s ready.
          </p>
        </Reveal>
      ) : (
        <div className="mt-14 space-y-6">
          {posts.map((post, i) => (
            <Reveal key={post.id} delay={(i % 3) * 0.06}>
              <Link href={`/blog/${post.slug}`} className="block">
                <article className="rounded-2xl border border-border bg-bg-card p-6 transition-colors hover:border-mint/60">
                  <h2 className="font-display text-xl font-bold text-ink">{post.title}</h2>
                  <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
                  <p className="mono-label mt-3 text-[11px] text-ink-faint">
                    {new Date(post.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </article>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
