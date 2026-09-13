"use client";

import { useEffect, useState, useCallback } from "react";
import { LogOut, Plus } from "lucide-react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { getAllPosts, deletePost, deleteCoverImage, type Post } from "@/lib/posts";
import LoginForm from "@/components/admin/LoginForm";
import PostList from "@/components/admin/PostList";
import PostEditor from "@/components/admin/PostEditor";

export default function AdminPage() {
  const { user, checking, login, logout } = useAdminAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [editing, setEditing] = useState<Post | null | "new">(null);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = useCallback(async () => {
    setLoadingPosts(true);
    try {
      setPosts(await getAllPosts());
      setError(null);
    } catch {
      setError("Couldn't load posts — check Firestore rules are deployed.");
    } finally {
      setLoadingPosts(false);
    }
  }, []);

  useEffect(() => {
    // Fetching Firestore data in response to the Firebase auth state
    // settling (not a plain render-time value) — this is the "subscribe
    // to an external system" case the lint rule's guidance carves out,
    // not the cascading-render anti-pattern it's guarding against.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (user) refreshPosts();
  }, [user, refreshPosts]);

  async function handleDelete(post: Post) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    await deletePost(post.id);
    if (post.coverImage) await deleteCoverImage(post.coverImage);
    refreshPosts();
  }

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="mono-label text-xs text-ink-faint">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <LoginForm onSubmit={login} />;
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex items-center justify-between">
        <div>
          <p className="mono-label text-xs text-mint">Admin</p>
          <h1 className="font-display text-2xl font-bold text-ink">Posts</h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-ink"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {editing ? (
        <div className="mt-8">
          <PostEditor
            post={editing === "new" ? null : editing}
            onDone={() => {
              setEditing(null);
              refreshPosts();
            }}
            onCancel={() => setEditing(null)}
          />
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={() => setEditing("new")}
            className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-105"
          >
            <Plus size={15} /> New post
          </button>

          <div className="mt-6">
            {loadingPosts ? (
              <p className="text-sm text-ink-faint">Loading posts…</p>
            ) : (
              <PostList posts={posts} onEdit={setEditing} onDelete={handleDelete} />
            )}
          </div>
        </>
      )}
    </div>
  );
}
