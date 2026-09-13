import Reveal from "@/components/Reveal";
import ShareButtons from "@/components/ShareButtons";
import { brand, siteUrl } from "@/data/site";
import { getPostBySlug, getPublishedPosts } from "@/lib/posts";
import { blogPostingJsonLd } from "@/lib/schema";
import DOMPurify from "isomorphic-dompurify";
import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 300;

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  // Best-effort at build time — if Firestore can't be reached (rules not
  // deployed yet, no network in this build environment), fall back to no
  // pre-rendered posts rather than failing the build; `revalidate` picks
  // them up on first request once Firestore is reachable.
  try {
    const posts = await getPublishedPosts();
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") return {};

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      url: `${siteUrl}/blog/${post.slug}`,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
    // Set explicitly (rather than left to inherit the root layout's
    // account-level twitter.creator/site config) so a post with a cover
    // image gets that image in the card LinkedIn/X preview when shared,
    // instead of no image at all.
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post || post.status !== "published") notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-20">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(blogPostingJsonLd(post)),
        }}
      />
      <Reveal>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink-soft transition-colors hover:text-mint"
        >
          <ArrowLeft size={14} /> All notes
        </Link>

        <h1 className="mt-6 break-words font-display text-4xl font-bold text-ink md:text-5xl">
          {post.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-faint">
          <span className="mono-label">
            {new Date(post.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span aria-hidden="true">·</span>
          <span className="mono-label">
            By{" "}
            <Link href="/about" className="text-ink-soft hover:text-mint">
              {brand.founder}
            </Link>
          </span>
        </div>
      </Reveal>

      {post.coverImage && (
        <Reveal delay={0.05}>
          {/* eslint-disable-next-line @next/next/no-img-element -- Storage download URL */}
          <img
            src={post.coverImage}
            alt={post.title}
            className="mt-8 h-[280px] w-full rounded-2xl border border-border object-cover md:h-[380px]"
          />
        </Reveal>
      )}

      <Reveal delay={0.1}>
        {/* Content is authored by the admin-only rich text editor and
            sanitized here as defense in depth before being injected as
            raw HTML. */}
        <div
          className="markdown-content mt-8"
          // eslint-disable-next-line react/no-danger -- sanitized below
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(post.content, {
              ADD_ATTR: ["style", "data-align"],
            }),
          }}
        />
      </Reveal>

      <Reveal delay={0.15}>
        <div className="mt-12 border-t border-border-soft/60 pt-6">
          <ShareButtons
            url={`${siteUrl}/blog/${post.slug}`}
            title={post.title}
          />
        </div>
      </Reveal>
    </div>
  );
}
