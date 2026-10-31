"use client";

import { AlertCircle, PartyPopper, Target } from "lucide-react";
import type { BoardTask, Habit } from "@/lib/board";
import { daysBetween } from "./dates";

export type Nudge = { tone: "warn" | "good" | "info"; text: string };

/** At most two small, actionable nudges. Kind, never shaming. */
export function buildNudges({
  tasks,
  habits,
  habitsDoneToday,
  lastLearn,
  now,
}: {
  tasks: BoardTask[];
  habits: Habit[];
  habitsDoneToday: number;
  lastLearn: Date | null;
  now: Date;
}): Nudge[] {
  const out: Nudge[] = [];
  const open = tasks.filter((t) => !t.done);
  const hour = now.getHours();

  if (habits.length && habitsDoneToday === habits.length) out.push({ tone: "good", text: "Every habit done today. That's how streaks are built." });

  const learnGap = lastLearn ? daysBetween(lastLearn, now) : null;
  if (learnGap === null) out.push({ tone: "info", text: "No learning logged yet. One JS Gym exercise, 10 minutes, today." });
  else if (learnGap >= 2) out.push({ tone: "warn", text: `Last learning was ${learnGap} days ago. Just open JS Gym for 10 minutes.` });

  const oldest = open.find((t) => t.createdAt && daysBetween(t.createdAt, now) >= 3);
  if (oldest) out.push({ tone: "warn", text: `"${oldest.title}" has waited ${daysBetween(oldest.createdAt!, now)} days. Do it first, or delete it.` });

  if (open.length === 0 && hour < 20) out.push({ tone: "info", text: "No focus set. What's the one thing that makes today count?" });
  if (open.length > 6) out.push({ tone: "info", text: `${open.length} things waiting. Keep three, park the rest in Notion.` });
  if (hour >= 19 && habits.length && habitsDoneToday === 0) out.push({ tone: "warn", text: "Evening check: no habit ticked yet. Pick the smallest one." });

  return out.slice(0, 2);
}

const STYLE = {
  warn: "border-amber-300/25 bg-amber-300/[0.06] text-amber-100",
  good: "border-mint/30 bg-mint/[0.07] text-mint",
  info: "border-white/10 bg-white/[0.03] text-ink-soft",
};
const ICON = { warn: AlertCircle, good: PartyPopper, info: Target };

export default function Nudges({ nudges }: { nudges: Nudge[] }) {
  if (!nudges.length) return null;
  return (
    <div className="flex flex-col gap-2">
      {nudges.map((n) => {
        const Icon = ICON[n.tone];
        return (
          <p key={n.text} className={`flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[14px] leading-snug ${STYLE[n.tone]}`}>
            <Icon size={16} className="mt-0.5 shrink-0" />
            {n.text}
          </p>
        );
      })}
    </div>
  );
}
