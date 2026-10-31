"use client";

import { CircleCheck, GitPullRequest, GraduationCap, Trophy } from "lucide-react";
import type { BoardTask } from "@/lib/board";
import { ago, daysBetween } from "./dates";
import type { Wins } from "./useBoard";

type Win = { kind: "task" | "gym" | "pr"; title: string; sub: string; at: Date; url?: string };

const ICON = {
  task: <CircleCheck size={16} className="text-mint" />,
  gym: <GraduationCap size={16} className="text-violet" />,
  pr: <GitPullRequest size={16} className="text-sky-300" />,
};

const prettyExercise = (id: string) =>
  (id.split("/").pop() ?? id).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

export default function WinsCard({ tasks, wins, learnDays, now }: { tasks: BoardTask[]; wins: Wins | null; learnDays: number; now: Date }) {
  const weekAgo = now.getTime() - 7 * 86_400_000;
  const items: Win[] = [];
  tasks.forEach((t) => {
    if (t.done && t.doneAt && t.doneAt.getTime() >= weekAgo) items.push({ kind: "task", title: t.title, sub: "Focus done", at: t.doneAt });
  });
  wins?.gym.forEach((g) => {
    const at = new Date(g.at);
    if (at.getTime() >= weekAgo) items.push({ kind: "gym", title: prettyExercise(g.id), sub: `JS Gym · ${g.kind} passed`, at });
  });
  wins?.prs.forEach((p) => items.push({ kind: "pr", title: p.title, sub: `Shipped · ${p.repo}`, at: new Date(p.at), url: p.url }));
  items.sort((a, b) => b.at.getTime() - a.at.getTime());

  const stats = [
    { n: items.filter((i) => i.kind === "task").length, label: "focus done" },
    { n: learnDays, label: "learning days" },
    { n: items.filter((i) => i.kind === "pr").length, label: "PRs shipped" },
  ];

  return (
    <section className="board-card flex min-h-0 flex-col">
      <header className="flex items-center justify-between gap-4">
        <p className="mono-label flex items-center gap-2 text-[11px] text-ink-faint">
          <Trophy size={13} className="text-amber-300" /> Hall of fame · this week
        </p>
        {wins && !wins.configured && <p className="mono-label text-[10px] text-ink-faint/70">GitHub not connected</p>}
      </header>

      <div className="mt-4 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
            <p className="font-display text-[clamp(26px,2.4vw,40px)] font-extrabold leading-none tabular-nums text-ink">{s.n}</p>
            <p className="mono-label mt-1.5 text-[10px] text-ink-faint">{s.label}</p>
          </div>
        ))}
      </div>

      <ul className="mt-4 flex min-h-0 flex-1 flex-col gap-0.5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_75%,transparent)]">
        {items.length === 0 && (
          <li className="py-3 text-sm text-ink-faint">Nothing yet this week. The first win is the hardest; make it a small one.</li>
        )}
        {items.slice(0, 8).map((w, i) => {
          const body = (
            <>
              <span className="mt-0.5 shrink-0">{ICON[w.kind]}</span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium text-ink">{w.title}</span>
                <span className="block truncate text-[12px] text-ink-faint">{w.sub}</span>
              </span>
              <span className="mono-label shrink-0 pt-0.5 text-[10px] text-ink-faint/80">
                {daysBetween(w.at, now) === 0 ? w.at.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }) : ago(w.at, now)}
              </span>
            </>
          );
          return (
            <li key={`${w.kind}-${i}-${w.at.getTime()}`}>
              {w.url ? (
                <a href={w.url} target="_blank" rel="noopener noreferrer" className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-white/[0.03]">
                  {body}
                </a>
              ) : (
                <div className="-mx-2 flex items-start gap-3 rounded-xl px-2 py-2">{body}</div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
