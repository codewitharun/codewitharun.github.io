"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImagePlus, X } from "lucide-react";
import {
  createPost,
  updatePost,
  uploadCoverImage,
  slugify,
  type Post,
  type PostStatus,
} from "@/lib/posts";

type PostEditorProps = {
  post: Post | null; // null = creating a new post
  onDone: () => void;
  onCancel: () => void;
};

export default function PostEditor({ post, onDone, onCancel }: PostEditorProps) {
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [coverImage, setCoverImage] = useState<string | null>(post?.coverImage ?? null);
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) setSlug(slugify(value));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadCoverImage(slug || slugify(title) || "post", file);
      setCoverImage(url);
    } catch {
      setError("Image upload failed — check Storage rules are deployed.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleSave(nextStatus: PostStatus) {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError(null);
    const input = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content,
      coverImage,
      status: nextStatus,
    };
    try {
      if (post) {
        await updatePost(post.id, input);
      } else {
        await createPost(input);
      }
      setStatus(nextStatus);
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
          {post ? "Edit post" : "New post"}
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
        Slug (techtiten.com/blog/…)
        <input
          value={slug}
          onChange={(e) => {
            setSlugTouched(true);
            setSlug(slugify(e.target.value));
          }}
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-mint"
        />
      </label>

      <label className="mt-4 block text-xs text-ink-faint">
        Excerpt
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
        />
      </label>

      <div className="mt-4">
        <p className="text-xs text-ink-faint">Cover image</p>
        <div className="mt-1.5 flex items-center gap-3">
          {coverImage && (
            // eslint-disable-next-line @next/next/no-img-element -- Storage download URL, not a build-time-known asset
            <img
              src={coverImage}
              alt="Cover"
              className="h-16 w-24 rounded-lg border border-border object-cover"
            />
          )}
          <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-mint hover:text-mint">
            <ImagePlus size={14} />
            {uploading ? "Uploading…" : coverImage ? "Replace" : "Upload"}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </label>
          {coverImage && (
            <button
              type="button"
              onClick={() => setCoverImage(null)}
              className="text-xs text-ink-faint hover:text-red-400"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-ink-faint">Content (Markdown)</p>
        <button
          type="button"
          onClick={() => setShowPreview((v) => !v)}
          className="mono-label text-[11px] text-ink-faint hover:text-mint"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {showPreview ? (
        <div className="markdown-content mt-1.5 min-h-[240px] rounded-lg border border-border bg-bg px-4 py-3 text-sm text-ink-soft">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || "*Nothing yet.*"}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={14}
          className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm text-ink outline-none focus:border-mint"
        />
      )}

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave("draft")}
          className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-mint hover:text-mint disabled:opacity-60"
        >
          Save draft
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSave("published")}
          className="rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-sm font-semibold text-bg transition-opacity disabled:opacity-60"
        >
          {status === "published" ? "Save & keep published" : "Publish"}
        </button>
      </div>
    </div>
  );
}
