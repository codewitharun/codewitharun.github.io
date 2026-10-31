"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import { CircleCheck, CircleSlash, CircleX, LoaderCircle, Workflow } from "lucide-react";

type Run = {
  repo: string;
  workflow: string;
  title: string;
  branch: string;
  status: string;
  conclusion: string | null;
  url: string;
  startedAt: string;
  updatedAt: string;
};
type Ci = { configured: boolean; active: Run[]; recent: Run[]; hint?: string };

/** Polls GitHub Actions: every 20 s while something runs, every 2 min when quiet. */
export function useCi(user: User | null) {
  const [ci, setCi] = useState<Ci | null>(null);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      let next = 120_000;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/board/ci", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as Ci;
          if (!alive) return;
          setCi(data);
          if (data.active.length) next = 20_000;
        }
      } catch {
        /* keep the last state */
      }
      if (alive) timer = setTimeout(load, next);
    };
    load();
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, [user]);
  return ci;
}

const mins = (from: string, now: Date) => {
  const s = Math.max(0, Math.round((now.getTime() - Date.parse(from)) / 1000));
  return s < 60 ? `${s}s` : s < 3600 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
};
const ago = (iso: string, now: Date) => {
  const m = Math.round((now.getTime() - Date.parse(iso)) / 60000);
  return m < 60 ? `${Math.max(m, 1)}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};

export default function PipelinesCard({ ci, now }: { ci: Ci | null; now: Date }) {
  const [tick, setTick] = useState(now);
  const running = !!ci?.active.length;
  // A live seconds counter only while something is running.
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setTick(new Date()), 1000);
    return () => clearInterval(t);
  }, [running]);
  const clock = running ? tick : now;

  return (
    <section className="board-card flex min-h-[120px] shrink flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-4">
        <p className="mono-label flex items-center gap-2 text-[11px] text-ink-faint">
          <Workflow size={13} className="text-sky-300" /> Pipelines
        </p>
        {running ? (
          <p className="mono-label flex items-center gap-2 text-[10px] text-sky-300">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-sky-300 opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-sky-300" />
            </span>
            {ci!.active.length} running
          </p>
        ) : (
          ci?.configured && <p className="mono-label text-[10px] text-ink-faint/70">All quiet</p>
        )}
      </header>

      {!ci && <p className="mt-3 text-sm text-ink-faint">Checking GitHub…</p>}
      {ci && !ci.configured && <p className="mt-3 text-sm text-ink-faint">Add BOARD_GITHUB_TOKEN in Vercel to see builds.</p>}
      {ci?.hint && <p className="mt-3 text-sm text-amber-200/90">{ci.hint}</p>}

      <ul className="mt-3 flex min-h-0 flex-col gap-1 overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        {ci?.active.map((r) => (
          <li key={r.url}>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="-mx-2 flex items-center gap-3 rounded-xl bg-sky-300/[0.06] px-3 py-2.5 ring-1 ring-sky-300/20 transition-colors hover:bg-sky-300/10">
              <LoaderCircle size={18} className={`shrink-0 text-sky-300 ${r.status === "in_progress" ? "animate-spin" : "opacity-60"}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-semibold text-ink">
                  {r.repo} <span className="font-normal text-ink-faint">· {r.workflow}</span>
                </span>
                <span className="block truncate text-[12px] text-ink-faint">{r.title || r.branch}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] tabular-nums text-sky-200">{r.status === "in_progress" ? mins(r.startedAt, clock) : r.status}</span>
            </a>
          </li>
        ))}
        {ci?.recent.slice(0, running ? 2 : 4).map((r) => {
          const ok = r.conclusion === "success";
          const skipped = r.conclusion === "skipped" || r.conclusion === "cancelled";
          const Icon = ok ? CircleCheck : skipped ? CircleSlash : CircleX;
          return (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="-mx-2 flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-white/[0.03]">
                <Icon size={16} className={`shrink-0 ${ok ? "text-mint" : skipped ? "text-ink-faint" : "text-red-400"}`} />
                <span className="min-w-0 flex-1 truncate text-[13px] text-ink-soft">
                  <span className="text-ink">{r.repo}</span> · {r.workflow}
                </span>
                <span className="mono-label shrink-0 text-[10px] text-ink-faint/80">{ago(r.updatedAt, now)}</span>
              </a>
            </li>
          );
        })}
        {ci?.configured && !ci.active.length && !ci.recent.length && !ci.hint && (
          <li className="py-1 text-sm text-ink-faint">No builds in the last 3 days.</li>
        )}
      </ul>
    </section>
  );
}
