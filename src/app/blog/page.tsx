import type { Metadata } from "next";
import Reveal from "@/components/Reveal";
import BlogList from "@/components/BlogList";
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
        // Search + pagination happen client-side over the already-fetched
        // list — plenty fast at personal-blog scale, and avoids a server
        // round trip on every keystroke or page click.
        <BlogList posts={posts} />
      )}
    </div>
  );
}
