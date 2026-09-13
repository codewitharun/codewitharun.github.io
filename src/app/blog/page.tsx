import type { Metadata } from "next";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on React Native, shipping imperfect things, and building Techtiten.",
};

// No posts yet — this is an intentional empty state, not a missing
// feature. Wire a real source (MDX files, a headless CMS, whatever) in
// here later; the page/route/metadata are already correct either way.
const posts: { title: string; slug: string; excerpt: string }[] = [];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <Reveal>
        <p className="mono-label mb-3 text-xs text-mint">Blog</p>
        <h1 className="font-display text-4xl font-bold text-ink md:text-5xl">Notes</h1>
      </Reveal>

      {posts.length === 0 ? (
        <Reveal delay={0.1} className="mt-14 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="mono-label text-xs text-ink-faint">$ ls posts</p>
          <p className="mt-3 text-ink-soft">
            Nothing published yet. First post is coming — probably about shipping something
            before it&apos;s ready.
          </p>
        </Reveal>
      ) : (
        <div className="mt-14 space-y-6">
          {posts.map((post) => (
            <article key={post.slug} className="rounded-2xl border border-border bg-bg-card p-6">
              <h2 className="font-display text-xl font-bold text-ink">{post.title}</h2>
              <p className="mt-2 text-sm text-ink-soft">{post.excerpt}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
