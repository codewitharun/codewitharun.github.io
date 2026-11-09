"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { LogOut, Plus } from "lucide-react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { getAllPosts, deletePost, deleteCoverImage, type Post } from "@/lib/posts";
import {
  getAllMessages,
  setMessageRead,
  deleteMessage,
  type ContactMessage,
} from "@/lib/messages";
import { revalidatePaths } from "@/lib/revalidate";
import { auth } from "@/lib/firebase";
import type { PostStatsResponse } from "@/app/api/admin/post-stats/route";
import LoginForm from "@/components/admin/LoginForm";
import PostList from "@/components/admin/PostList";
import PostEditor from "@/components/admin/PostEditor";
import MessageList from "@/components/admin/MessageList";

// Projects are not edited here any more: they live in code
// (src/content/projects.ts), with their images in public/projects/.
type Tab = "posts" | "messages";

function PostsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null | "new">(null);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState(30);
  const [sort, setSort] = useState<"newest" | "views" | "store" | "search">("newest");
  const [stats, setStats] = useState<PostStatsResponse | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  // Real numbers per post (GA4 + Search Console), see /api/admin/post-stats.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = await auth.currentUser?.getIdToken();
        const res = await fetch(`/api/admin/post-stats?days=${days}`, { headers: { Authorization: `Bearer ${token ?? ""}` } });
        const data = await res.json();
        if (cancelled) return;
        if (!res.ok) throw new Error(data?.error || `HTTP ${res.status}`);
        setStats(data);
        setStatsError(null);
      } catch (e) {
        if (!cancelled) setStatsError(e instanceof Error ? e.message : "Couldn't load stats");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [days]);

  const sortedPosts = useMemo(() => {
    if (sort === "newest" || !stats) return posts;
    const val = (p: Post) => {
      const s = stats.posts[p.slug];
      if (!s) return -1;
      return sort === "views" ? s.views : sort === "store" ? s.storeClicks : s.searchClicks * 1000 + s.searchImpressions;
    };
    return [...posts].sort((a, b) => val(b) - val(a));
  }, [posts, stats, sort]);

  const totals = useMemo(() => {
    const all = Object.values(stats?.posts ?? {});
    return {
      views: all.reduce((n, s) => n + s.views, 0),
      store: all.reduce((n, s) => n + s.storeClicks, 0),
      shown: all.reduce((n, s) => n + s.searchImpressions, 0),
      clicks: all.reduce((n, s) => n + s.searchClicks, 0),
    };
  }, [stats]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setPosts(await getAllPosts());
      setError(null);
    } catch {
      setError("Couldn't load posts — check Firestore rules are deployed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function handleDelete(post: Post) {
    if (!confirm(`Delete "${post.title}"? This can't be undone.`)) return;
    await deletePost(post.id);
    if (post.coverImage) await deleteCoverImage(post.coverImage);
    revalidatePaths(["/blog", `/blog/${post.slug}`, "/rss.xml"]);
    refresh();
  }

  if (error) return <p className="mt-6 text-sm text-red-400">{error}</p>;

  if (editing) {
    return (
      <div className="mt-8">
        <PostEditor
          post={editing === "new" ? null : editing}
          onDone={() => {
            setEditing(null);
            refresh();
          }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setEditing("new")}
        className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-mint px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-105"
      >
        <Plus size={15} /> New post
      </button>

      <div className="mt-6 rounded-2xl border border-border bg-bg-card p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="mono-label text-xs text-mint">Blog numbers</p>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`rounded-full border px-2.5 py-1 transition-colors ${
                  days === d ? "border-mint/60 bg-mint/15 text-mint" : "border-border text-ink-soft hover:text-ink"
                }`}
              >
                {d} days
              </button>
            ))}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as typeof sort)}
              aria-label="Sort posts"
              className="rounded-full border border-border bg-bg px-2.5 py-1 text-ink-soft outline-none"
            >
              <option value="newest">Newest first</option>
              <option value="store">Most store clicks</option>
              <option value="views">Most views</option>
              <option value="search">Most Google clicks</option>
            </select>
          </div>
        </div>
        {statsError ? (
          <p className="mt-3 text-xs text-red-400">Stats: {statsError}</p>
        ) : !stats ? (
          <p className="mt-3 text-xs text-ink-faint">Loading numbers…</p>
        ) : (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["Blog views", totals.views],
                ["Store clicks", totals.store],
                ["Shown on Google", totals.shown],
                ["Google clicks", totals.clicks],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <p className="font-display text-xl font-bold text-ink">{value}</p>
                  <p className="text-[11px] text-ink-faint">{label}</p>
                </div>
              ))}
            </div>
            {(stats.sources.analytics !== "ok" || stats.sources.search !== "ok") && (
              <p className="mt-3 text-[11px] text-amber-400">
                Analytics: {stats.sources.analytics} · Search Console: {stats.sources.search}
              </p>
            )}
            <p className="mt-2 text-[11px] text-ink-faint">
              Analytics is a few hours behind and Google search 2–3 days behind. Ad blockers hide some visits.
            </p>
          </>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-faint">Loading posts…</p>
        ) : (
          <PostList posts={sortedPosts} onEdit={setEditing} onDelete={handleDelete} stats={stats?.posts} />
        )}
      </div>
    </>
  );
}

function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setMessages(await getAllMessages());
      setError(null);
    } catch {
      setError("Couldn't load messages — check Firestore rules are deployed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function handleToggleRead(message: ContactMessage, read: boolean) {
    // Optimistic update — this is a read/unread flip a person clicks
    // through repeatedly, and waiting on a round trip for something this
    // small would make the list feel sluggish.
    setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, read } : m)));
    try {
      await setMessageRead(message.id, read);
    } catch {
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, read: !read } : m)));
    }
  }

  async function handleDelete(message: ContactMessage) {
    if (!confirm(`Delete the message from "${message.name}"? This can't be undone.`)) return;
    await deleteMessage(message.id);
    refresh();
  }

  if (error) return <p className="mt-6 text-sm text-red-400">{error}</p>;

  return (
    <div className="mt-6">
      {loading ? (
        <p className="text-sm text-ink-faint">Loading messages…</p>
      ) : (
        <MessageList
          messages={messages}
          onToggleRead={handleToggleRead}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}

export default function AdminPage() {
  const { user, checking, login, logout } = useAdminAuth();
  const [tab, setTab] = useState<Tab>("posts");

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
          <h1 className="font-display text-2xl font-bold text-ink">
            {tab === "posts" ? "Posts" : "Messages"}
          </h1>
        </div>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-1.5 text-sm text-ink-faint transition-colors hover:text-ink"
        >
          <LogOut size={15} /> Sign out
        </button>
      </div>

      <div className="mt-6 flex gap-2 border-b border-border-soft">
        {(["posts", "messages"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`mono-label -mb-px border-b-2 px-3 py-2 text-xs transition-colors ${
              tab === t
                ? "border-mint text-mint"
                : "border-transparent text-ink-faint hover:text-ink"
            }`}
          >
            {t === "posts" ? "Posts" : "Messages"}
          </button>
        ))}
      </div>

      {tab === "posts" ? <PostsPanel /> : <MessagesPanel />}
    </div>
  );
}
