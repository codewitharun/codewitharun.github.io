"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  MailOpen,
  Phone,
  Search,
  Trash2,
} from "lucide-react";
import type { ContactMessage } from "@/lib/messages";

type MessageListProps = {
  messages: ContactMessage[];
  onToggleRead: (message: ContactMessage, read: boolean) => void;
  onDelete: (message: ContactMessage) => void;
};

const PAGE_SIZE = 8;

function formatDate(ms: number): string {
  if (!ms) return "";
  return new Date(ms).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function MessageList({ messages, onToggleRead, onDelete }: MessageListProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return messages.filter((m) => {
      if (filter === "unread" && m.read) return false;
      if (!q) return true;
      return (
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.phone.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    });
  }, [messages, query, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageMessages = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  function toggleExpand(message: ContactMessage) {
    const willExpand = expandedId !== message.id;
    setExpandedId(willExpand ? message.id : null);
    // Opening a message is what "reading" it means here — mirrors any
    // inbox. Collapsing it back doesn't re-mark it unread; there's a
    // dedicated button for that.
    if (willExpand && !message.read) onToggleRead(message, true);
  }

  if (messages.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-sm text-ink-soft">
          No messages yet — they&apos;ll show up here as visitors use the contact form.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
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
            placeholder="Search by name, email, phone, or message…"
            aria-label="Search messages"
            className="w-full rounded-full border border-border bg-bg px-3 py-2 pl-10 text-sm text-ink outline-none transition-colors focus:border-mint/60"
          />
        </div>
        <div className="flex shrink-0 gap-1.5">
          {(["all", "unread"] as const).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={`mono-label rounded-full border px-3.5 py-2 text-xs transition-colors ${
                filter === f
                  ? "border-mint/60 bg-mint/15 text-mint"
                  : "border-border text-ink-soft hover:border-mint hover:text-mint"
              }`}
            >
              {f === "all" ? "All" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-4 rounded-2xl border border-dashed border-border p-10 text-center">
          <p className="text-sm text-ink-soft">
            {filter === "unread" ? "No unread messages." : `No messages match "${query}".`}
          </p>
        </div>
      ) : (
        <>
          <div className="mt-4 divide-y divide-border-soft rounded-2xl border border-border bg-bg-card">
            {pageMessages.map((message) => {
              const expanded = expandedId === message.id;
              return (
                <div key={message.id}>
                  <button
                    type="button"
                    onClick={() => toggleExpand(message)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left"
                    aria-expanded={expanded}
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <span
                        className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${
                          message.read ? "bg-transparent" : "bg-mint"
                        }`}
                        aria-hidden="true"
                      />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-x-2">
                          <p
                            className={`truncate font-display text-sm ${
                              message.read ? "font-medium text-ink-soft" : "font-bold text-ink"
                            }`}
                          >
                            {message.name}
                          </p>
                          <span className="text-xs text-ink-faint">
                            {formatDate(message.createdAt)}
                          </span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-faint">
                          <span className="flex items-center gap-1">
                            <Mail size={11} /> {message.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={11} /> {message.phone}
                          </span>
                        </div>
                        {!expanded && (
                          <p className="mt-1 truncate text-sm text-ink-faint">{message.message}</p>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`shrink-0 text-ink-faint transition-transform ${
                        expanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {expanded && (
                    <div className="px-4 pb-4 pl-9">
                      <p className="whitespace-pre-wrap text-sm text-ink-soft">
                        {message.message}
                      </p>
                      <div className="mt-3 flex flex-wrap items-center gap-4">
                        <a
                          href={`mailto:${message.email}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint hover:underline"
                        >
                          <Mail size={13} /> Reply by email
                        </a>
                        <a
                          href={`tel:${message.phone}`}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-mint hover:underline"
                        >
                          <Phone size={13} /> Call
                        </a>
                        <button
                          type="button"
                          onClick={() => onToggleRead(message, !message.read)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-soft transition-colors hover:text-ink"
                        >
                          {message.read ? (
                            <>
                              <Mail size={13} /> Mark unread
                            </>
                          ) : (
                            <>
                              <MailOpen size={13} /> Mark read
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(message)}
                          className="ml-auto inline-flex items-center gap-1.5 text-xs font-semibold text-ink-faint transition-colors hover:text-red-400"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <nav
              aria-label="Message list pagination"
              className="mt-4 flex items-center justify-center gap-1.5"
            >
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
