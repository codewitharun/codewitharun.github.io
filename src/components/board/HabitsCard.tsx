"use client";

import { Check, Flame, Sparkles } from "lucide-react";
import { setHabit, type BoardDays, type Habit } from "@/lib/board";
import { addDays, dayKey, startOfDay, streak } from "./dates";
import { GRID_DAYS } from "./useBoard";

const WEEKS = GRID_DAYS / 7;
const LEVEL = ["bg-white/[0.045]", "bg-mint/[0.18]", "bg-mint/[0.35]", "bg-mint/60", "bg-mint/90"];

type Props = {
  habits: Habit[];
  days: BoardDays;
  /** day keys with a JS Gym pass: they count as "learn" automatically */
  gymDays: Set<string>;
  now: Date;
};

export function isHabitDone(days: BoardDays, gymDays: Set<string>, key: string, habitId: string) {
  return !!days[key]?.has(habitId) || (habitId === "learn" && gymDays.has(key));
}

export default function HabitsCard({ habits, days, gymDays, now }: Props) {
  const todayKey = dayKey(now);
  const doneOn = (key: string) => habits.filter((h) => isHabitDone(days, gymDays, key, h.id)).length;

  // Grid: columns are weeks (Mon..Sun), oldest left, this week right.
  const today = startOfDay(now);
  const mondayThisWeek = addDays(today, -((today.getDay() + 6) % 7));
  const start = addDays(mondayThisWeek, -(WEEKS - 1) * 7);
  const weeks = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(start, w * 7 + d)),
  );

  let weekDone = 0;
  for (let i = 0; i < 7; i++) weekDone += doneOn(dayKey(addDays(today, -i)));
  const weekMax = habits.length * 7;
  const anyDay = (key: string) => doneOn(key) > 0;
  const showUp = streak(anyDay, now);

  return (
    <section className="board-card flex min-h-0 flex-col">
      <header className="flex items-baseline justify-between gap-4">
        <p className="mono-label text-[11px] text-ink-faint">Habits · today</p>
        <p className="mono-label text-[11px] text-ink-faint">
          Last 7 days <span className="text-ink">{weekDone}</span>/{weekMax}
        </p>
      </header>

      <div className="mt-4 grid gap-2.5" style={{ gridTemplateColumns: `repeat(${Math.max(habits.length, 1)}, minmax(0, 1fr))` }}>
        {habits.map((h) => {
          const manual = !!days[todayKey]?.has(h.id);
          const auto = h.id === "learn" && gymDays.has(todayKey);
          const done = manual || auto;
          const s = streak((k) => isHabitDone(days, gymDays, k, h.id), now);
          return (
            <button
              key={h.id}
              onClick={() => setHabit(todayKey, h.id, !manual)}
              disabled={auto && !manual}
              title={auto && !manual ? "Ticked automatically: you passed a JS Gym exercise today" : undefined}
              className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 ${
                done
                  ? "border-mint/40 bg-mint/[0.08]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/20"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`grid size-7 place-items-center rounded-full border-2 transition-all duration-300 ${
                    done ? "border-transparent bg-mint text-bg" : "border-white/20 text-transparent group-hover:border-mint/70"
                  }`}
                >
                  <Check size={14} strokeWidth={3} />
                </span>
                <span className={`flex items-center gap-1 font-mono text-xs ${s > 0 ? "text-amber-300" : "text-ink-faint/50"}`}>
                  <Flame size={13} className={s > 0 ? "fill-amber-300/30" : ""} />
                  {s}
                </span>
              </div>
              <p className={`mt-3 font-display text-[15px] font-semibold leading-tight ${done ? "text-ink" : "text-ink-soft"}`}>{h.label}</p>
              {auto && (
                <p className="mono-label mt-1 flex items-center gap-1 text-[9px] text-mint/80">
                  <Sparkles size={10} /> via JS Gym
                </p>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-5 flex min-h-0 max-w-[720px] gap-2">
        <div className="mono-label grid shrink-0 grid-rows-7 gap-[3px] pt-[18px] text-[9px] leading-none text-ink-faint/60">
          {["M", "", "W", "", "F", "", "S"].map((l, i) => (
            <span key={i} className="flex items-center">{l}</span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="mono-label grid h-[18px] text-[9px] text-ink-faint/60" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
            {weeks.map((w, i) => {
              const first = w[0];
              const label = i === 0 || first.getDate() <= 7 ? first.toLocaleString("en", { month: "short" }) : "";
              return <span key={i} className="truncate">{label}</span>;
            })}
          </div>
          <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
            {weeks.map((w, i) => (
              <div key={i} className="grid grid-rows-7 gap-[3px]">
                {w.map((d) => {
                  const key = dayKey(d);
                  const future = d > today;
                  const n = future ? 0 : doneOn(key);
                  const level = habits.length ? Math.min(4, Math.ceil((n / habits.length) * 4)) : 0;
                  return (
                    <span
                      key={key}
                      title={future ? undefined : `${d.toDateString()}: ${n}/${habits.length}`}
                      className={`aspect-square w-full rounded-[3px] ${future ? "bg-transparent" : LEVEL[level]} ${
                        key === todayKey ? "ring-1 ring-ink/60 ring-offset-1 ring-offset-transparent" : ""
                      }`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-3 flex max-w-[720px] items-center justify-between gap-4">
      <p className="mono-label text-[10px] text-ink-faint">
        {showUp > 0 ? (
          <>
            Showed up <span className="text-mint">{showUp} day{showUp === 1 ? "" : "s"}</span> in a row
          </>
        ) : (
          "Tick one habit today to start a streak"
        )}
      </p>
      <p className="mono-label hidden items-center gap-1.5 text-[9px] text-ink-faint/70 sm:flex">
        Less
        {LEVEL.map((c) => (
          <span key={c} className={`size-2.5 rounded-[2px] ${c}`} />
        ))}
        More
      </p>
      </div>
    </section>
  );
}
