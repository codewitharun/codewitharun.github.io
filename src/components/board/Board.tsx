"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Settings2 } from "lucide-react";
import { useAdminAuth } from "@/lib/useAdminAuth";
import LoginForm from "@/components/admin/LoginForm";
import FocusCard from "./FocusCard";
import HabitsCard, { isHabitDone } from "./HabitsCard";
import WinsCard from "./WinsCard";
import Nudges, { buildNudges } from "./Nudges";
import SettingsSheet from "./SettingsSheet";
import { useBoard, useNow } from "./useBoard";
import { addDays, dayKey } from "./dates";

const greeting = (h: number) => (h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Late night");

export default function Board() {
  const { user, checking, login, logout } = useAdminAuth();
  if (checking) return <Shell />;
  if (!user) return <Shell><LoginForm onSubmit={login} /></Shell>;
  return <BoardInner user={user} logout={logout} />;
}

function Shell({ children }: { children?: React.ReactNode }) {
  return (
    <div className="board-root" data-clarity-mask="true">
      <Aurora />
      <div className="relative">{children}</div>
    </div>
  );
}

function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="absolute -left-[15%] -top-[25%] h-[70vh] w-[60vw] rounded-full bg-mint/[0.07] blur-[120px]" />
      <div className="absolute -bottom-[30%] right-[-10%] h-[75vh] w-[60vw] rounded-full bg-violet/[0.10] blur-[140px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.45))]" />
    </div>
  );
}

function BoardInner({ user, logout }: { user: NonNullable<ReturnType<typeof useAdminAuth>["user"]>; logout: () => Promise<void> }) {
  const now = useNow();
  const data = useBoard(user);
  const [showSettings, setShowSettings] = useState(false);
  return (
    <>
      <BoardView {...data} now={now} name={user.displayName?.split(" ")[0] || "Arun"} onSettings={() => setShowSettings(true)} />
      {showSettings && <SettingsSheet settings={data.settings} onClose={() => setShowSettings(false)} onLogout={logout} />}
    </>
  );
}

type ViewProps = Pick<ReturnType<typeof useBoard>, "settings" | "tasks" | "days" | "wins" | "error" | "online"> & {
  now: Date;
  name: string;
  onSettings: () => void;
};

/** The whole board, from plain data (also what a preview/demo renders). */
export function BoardView({ settings, tasks, days, wins, error, online, now, name, onSettings }: ViewProps) {

  const gymDays = useMemo(() => new Set((wins?.gym ?? []).map((g) => dayKey(new Date(g.at)))), [wins]);
  const todayKey = dayKey(now);
  const habitsDoneToday = settings.habits.filter((h) => isHabitDone(days, gymDays, todayKey, h.id)).length;

  // Last learning day: learn habit ticked or a JS Gym pass, whichever is later.
  const lastLearn = useMemo(() => {
    for (let i = 0; i < 200; i++) {
      const d = addDays(now, -i);
      if (isHabitDone(days, gymDays, dayKey(d), "learn")) return d;
    }
    return null;
  }, [days, gymDays, now]);
  let learnDays = 0;
  for (let i = 0; i < 7; i++) if (isHabitDone(days, gymDays, dayKey(addDays(now, -i)), "learn")) learnDays++;

  const nudges = buildNudges({ tasks, habits: settings.habits, habitsDoneToday, lastLearn, now });

  return (
    <Shell>
      <div className="board-frame mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col gap-5 px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 lg:gap-6 lg:px-12 lg:pb-10 lg:pt-10">
        <header className="flex items-start justify-between gap-6">
          <Clock now={now} name={name} />
          <div className="flex items-center gap-2 pt-2">
            <span className={`mono-label flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] ${online && !error ? "border-mint/20 text-mint/90" : "border-amber-300/30 text-amber-300"}`}>
              <span className={`size-1.5 rounded-full ${online && !error ? "animate-pulse bg-mint" : "bg-amber-300"}`} />
              {error ? "Sync error" : online ? "Live" : "Offline"}
            </span>
            <button onClick={onSettings} aria-label="Board settings" className="grid size-9 place-items-center rounded-full border border-white/[0.07] text-ink-faint transition-colors hover:border-white/20 hover:text-ink">
              <Settings2 size={16} />
            </button>
          </div>
        </header>

        {error && <p className="rounded-2xl border border-amber-300/30 bg-amber-300/[0.06] px-4 py-3 text-sm text-amber-100">{error}</p>}

        <div className="grid min-h-0 flex-1 grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
          <div className="flex min-h-0 flex-col gap-5 lg:col-span-5 lg:gap-6">
            <FocusCard tasks={tasks} now={now} />
            <Nudges nudges={nudges} />
          </div>
          <div className="grid min-h-0 grid-cols-1 gap-5 lg:col-span-7 lg:grid-rows-[auto_minmax(0,1fr)] lg:gap-6">
            <HabitsCard habits={settings.habits} days={days} gymDays={gymDays} now={now} />
            <WinsCard tasks={tasks} wins={wins} learnDays={learnDays} now={now} />
          </div>
        </div>

        <Reminder lines={settings.reminders} />
      </div>
    </Shell>
  );
}

function Clock({ now, name }: { now: Date; name: string }) {
  const time = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const [hm, ampm] = time.split(" ");
  return (
    <div>
      <p className="mono-label text-[11px] text-ink-faint">
        {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <h1 className="mt-1 flex items-baseline gap-3 font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-ink">
        <span className="text-[clamp(56px,7.5vw,128px)] tabular-nums">{hm}</span>
        <span className="font-mono text-[clamp(14px,1.2vw,20px)] font-medium uppercase tracking-normal text-ink-faint">{ampm}</span>
      </h1>
      <p className="mt-3 text-[clamp(15px,1.25vw,20px)] text-ink-soft">
        {greeting(now.getHours())}, <span className="text-gradient font-semibold">{name}</span>. One thing at a time.
      </p>
    </div>
  );
}

function Reminder({ lines }: { lines: string[] }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (lines.length < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % lines.length), 25_000);
    return () => clearInterval(t);
  }, [lines.length]);
  const line = lines[i % Math.max(lines.length, 1)] ?? "";
  if (!line) return null;
  return (
    <footer className="relative flex min-h-[2.5em] items-center gap-4 overflow-hidden">
      <span aria-hidden className="h-px w-10 shrink-0 bg-gradient-to-r from-mint to-violet" />
      <AnimatePresence mode="wait">
        <motion.p
          key={line}
          initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -10, filter: "blur(4px)" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-[clamp(17px,1.6vw,26px)] font-medium tracking-[-0.01em] text-ink-soft"
        >
          {line}
        </motion.p>
      </AnimatePresence>
    </footer>
  );
}
