"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Plus, X } from "lucide-react";
import { addTask, deleteTask, setTaskDone, type BoardTask } from "@/lib/board";
import { daysBetween, startOfDay } from "./dates";

const FOCUS_SLOTS = 3;

export default function FocusCard({ tasks, now }: { tasks: BoardTask[]; now: Date }) {
  const [draft, setDraft] = useState("");
  const today = startOfDay(now).getTime();
  const open = tasks.filter((t) => !t.done);
  const focus = open.slice(0, FOCUS_SLOTS);
  const later = open.slice(FOCUS_SLOTS);
  const doneToday = tasks.filter((t) => t.done && t.doneAt && t.doneAt.getTime() >= today);
  const total = focus.length + doneToday.length;

  async function add(e: React.FormEvent) {
    e.preventDefault();
    const title = draft.trim();
    if (!title) return;
    setDraft("");
    await addTask(title);
  }

  return (
    <section className="board-card flex min-h-0 flex-col">
      <header className="flex items-baseline justify-between gap-4">
        <p className="mono-label text-[11px] text-ink-faint">Today&apos;s focus</p>
        {total > 0 && (
          <p className="mono-label text-[11px] text-ink-faint">
            <span className="text-mint">{doneToday.length}</span> / {total} done
          </p>
        )}
      </header>

      <ul className="mt-5 flex flex-col gap-1">
        <AnimatePresence initial={false}>
          {focus.map((t, i) => (
            <TaskRow key={t.id} task={t} index={i} now={now} />
          ))}
          {doneToday.map((t) => (
            <TaskRow key={t.id} task={t} now={now} />
          ))}
        </AnimatePresence>
      </ul>

      {focus.length === 0 && doneToday.length === 0 && (
        <p className="mt-2 font-display text-2xl leading-snug text-ink-soft">
          What&apos;s the <span className="text-gradient">one thing</span> that makes today count?
        </p>
      )}

      <form onSubmit={add} className="group mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-white/10 px-4 py-3 transition-colors focus-within:border-mint/50">
        <Plus size={18} className="shrink-0 text-ink-faint transition-colors group-focus-within:text-mint" />
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={focus.length >= FOCUS_SLOTS ? "Add to later…" : "Add a focus for today…"}
          maxLength={200}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint/70"
        />
        {draft && <span className="mono-label hidden text-[10px] text-ink-faint sm:block">enter ↵</span>}
      </form>

      {later.length > 0 && (
        <div className="mt-5 min-h-0 overflow-hidden">
          <p className="mono-label text-[10px] text-ink-faint">Later · {later.length}</p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {later.slice(0, 6).map((t) => (
              <li key={t.id} className="group flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.02] py-1 pl-3 pr-1.5 text-[13px] text-ink-soft">
                <span className="max-w-[22ch] truncate">{t.title}</span>
                <button onClick={() => setTaskDone(t.id, true)} aria-label={`Done: ${t.title}`} className="grid size-5 place-items-center rounded-full text-ink-faint transition-colors hover:bg-mint/15 hover:text-mint">
                  <Check size={12} />
                </button>
              </li>
            ))}
            {later.length > 6 && <li className="py-1 text-[13px] text-ink-faint">+{later.length - 6}</li>}
          </ul>
        </div>
      )}
    </section>
  );
}

function TaskRow({ task, index, now }: { task: BoardTask; index?: number; now: Date }) {
  const age = task.createdAt ? daysBetween(task.createdAt, now) : 0;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -12 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="group -mx-3 flex items-center gap-4 rounded-2xl px-3 py-2.5 transition-colors hover:bg-white/[0.025]"
    >
      <button
        onClick={() => setTaskDone(task.id, !task.done)}
        aria-label={task.done ? `Mark not done: ${task.title}` : `Mark done: ${task.title}`}
        className={`grid size-8 shrink-0 place-items-center rounded-full border-2 transition-all duration-300 ${
          task.done
            ? "border-transparent bg-mint text-bg shadow-[0_0_24px_-4px_var(--mint)]"
            : "border-white/20 text-transparent hover:border-mint hover:text-mint/60"
        }`}
      >
        <Check size={16} strokeWidth={3} />
      </button>
      {index !== undefined && <span className="hidden w-6 shrink-0 font-mono text-xs text-ink-faint/60 sm:block">{String(index + 1).padStart(2, "0")}</span>}
      <span
        className={`min-w-0 flex-1 font-display text-[clamp(18px,1.6vw,26px)] font-semibold leading-tight transition-all duration-300 ${
          task.done ? "text-ink-faint line-through decoration-mint/60 decoration-2" : "text-ink"
        }`}
      >
        {task.title}
      </span>
      {!task.done && age >= 2 && (
        <span className={`mono-label shrink-0 rounded-full px-2 py-0.5 text-[10px] ${age >= 4 ? "bg-amber-400/10 text-amber-300" : "bg-white/5 text-ink-faint"}`}>
          {age}d
        </span>
      )}
      <button
        onClick={() => deleteTask(task.id)}
        aria-label={`Remove: ${task.title}`}
        className="grid size-7 shrink-0 place-items-center rounded-full text-ink-faint opacity-0 transition-opacity hover:bg-white/5 hover:text-ink group-hover:opacity-100 focus:opacity-100"
      >
        <X size={14} />
      </button>
    </motion.li>
  );
}
