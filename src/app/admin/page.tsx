"use client";

import { useEffect, useState, useCallback } from "react";
import { LogOut, Plus, Download } from "lucide-react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import { getAllPosts, deletePost, deleteCoverImage, type Post } from "@/lib/posts";
import {
  getAllProjects,
  deleteProject,
  deleteProjectImage,
  importFallbackProjectsIfEmpty,
  type ProjectDoc,
} from "@/lib/projects";
import {
  getAllMessages,
  setMessageRead,
  deleteMessage,
  type ContactMessage,
} from "@/lib/messages";
import { revalidatePaths } from "@/lib/revalidate";
import LoginForm from "@/components/admin/LoginForm";
import PostList from "@/components/admin/PostList";
import PostEditor from "@/components/admin/PostEditor";
import ProjectList from "@/components/admin/ProjectList";
import ProjectEditor from "@/components/admin/ProjectEditor";
import MessageList from "@/components/admin/MessageList";

type Tab = "posts" | "projects" | "messages";

function PostsPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null | "new">(null);
  const [error, setError] = useState<string | null>(null);

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
        className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-105"
      >
        <Plus size={15} /> New post
      </button>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-faint">Loading posts…</p>
        ) : (
          <PostList posts={posts} onEdit={setEditing} onDelete={handleDelete} />
        )}
      </div>
    </>
  );
}

function ProjectsPanel() {
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<ProjectDoc | null | "new">(null);
  const [error, setError] = useState<string | null>(null);
  const [importing, setImporting] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      setProjects(await getAllProjects());
      setError(null);
    } catch {
      setError("Couldn't load projects — check Firestore rules are deployed.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
  }, [refresh]);

  async function handleDelete(project: ProjectDoc) {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    await deleteProject(project.id);
    if (project.image?.startsWith("https://firebasestorage")) {
      await deleteProjectImage(project.image);
    }
    revalidatePaths(["/portfolio", `/portfolio/${project.slug}`, "/"]);
    refresh();
  }

  async function handleImport() {
    setImporting(true);
    try {
      await importFallbackProjectsIfEmpty();
      await refresh();
    } catch {
      setError("Import failed — check Firestore rules are deployed.");
    } finally {
      setImporting(false);
    }
  }

  if (error) return <p className="mt-6 text-sm text-red-400">{error}</p>;

  if (editing) {
    return (
      <div className="mt-8">
        <ProjectEditor
          project={editing === "new" ? null : editing}
          projects={projects}
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
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-mint to-violet px-4 py-2 text-sm font-semibold text-bg transition-transform hover:scale-105"
        >
          <Plus size={15} /> New project
        </button>
        {!loading && projects.length === 0 && (
          <button
            type="button"
            disabled={importing}
            onClick={handleImport}
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ink-soft transition-colors hover:border-mint hover:text-mint disabled:opacity-60"
          >
            <Download size={15} /> {importing ? "Importing…" : "Import starter projects"}
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-ink-faint">Loading projects…</p>
        ) : (
          <ProjectList projects={projects} onEdit={setEditing} onDelete={handleDelete} />
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
            {tab === "posts" ? "Posts" : tab === "projects" ? "Projects" : "Messages"}
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
        {(["posts", "projects", "messages"] as const).map((t) => (
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
            {t === "posts" ? "Posts" : t === "projects" ? "Projects" : "Messages"}
          </button>
        ))}
      </div>

      {tab === "posts" ? (
        <PostsPanel />
      ) : tab === "projects" ? (
        <ProjectsPanel />
      ) : (
        <MessagesPanel />
      )}
    </div>
  );
}
