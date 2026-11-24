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
import PipelinesCard, { useCi } from "./PipelinesCard";
import AppsStrip from "./AppsStrip";
import TitenCore from "./TitenCore";
import TitenLog from "./TitenLog";
import { useTiten, type TitenMood } from "./useTiten";
import { useStatus, type BoardStatus } from "./useStatus";
import type { Nudge } from "./Nudges";
import { useBoard, useNow } from "./useBoard";
import { addDays, dayKey, daysBetween } from "./dates";

const greeting = (h: number) => (h < 5 ? "Still up" : h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : h < 22 ? "Good evening" : "Late night");

export default function Board() {
  const { user, checking, login, logout } = useAdminAuth();
  if (checking) return <Shell />;
  if (!user) return <Shell><LoginForm onSubmit={login} /></Shell>;
  return <BoardInner user={user} logout={logout} />;
}

function Shell({ children, mood = "idle" }: { children?: React.ReactNode; mood?: TitenMood }) {
  return (
    <div className="board-root" data-titen={mood} data-clarity-mask="true">
      <Aurora />
      <div className="relative">{children}</div>
    </div>
  );
}

function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
      <div className="board-aurora" />
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:4px_4px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.5))]" />
    </div>
  );
}

// Room to leave free for desktop icons / widgets when used as a wallpaper:
// techtiten.com/board?right=420 (px) keeps the right 420px empty; ?left= too.
function useReservedSpace() {
  const [space, setSpace] = useState({ left: 0, right: 0 });
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const px = (k: string) => Math.max(0, Math.min(1200, Number(q.get(k)) || 0));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- read once from the URL after mount
    setSpace({ left: px("left"), right: px("right") });
  }, []);
  return space;
}

/** The old CRA site left a service worker on some phones; it breaks the board's calls to Titen. Remove it. */
function useNoOldServiceWorker() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister())).catch(() => {});
  }, []);
}

function BoardInner({ user, logout }: { user: NonNullable<ReturnType<typeof useAdminAuth>["user"]>; logout: () => Promise<void> }) {
  const now = useNow();
  const data = useBoard(user);
  const [showSettings, setShowSettings] = useState(false);
  const reserved = useReservedSpace();
  const ci = useCi(user);
  const status = useStatus(user);
  const titen = useTiten(data.settings.titenUrl);
  useNoOldServiceWorker();
  return (
    <>
      <BoardView {...data} now={now} name={user.displayName?.split(" ")[0] || "Arun"} onSettings={() => setShowSettings(true)} reserved={reserved} ci={ci} status={status} titen={titen} />
      {showSettings && <SettingsSheet settings={data.settings} onClose={() => setShowSettings(false)} onLogout={logout} />}
    </>
  );
}

type ViewProps = Pick<ReturnType<typeof useBoard>, "settings" | "tasks" | "days" | "wins" | "error" | "online"> & {
  now: Date;
  name: string;
  onSettings: () => void;
  reserved?: { left: number; right: number };
  ci?: ReturnType<typeof useCi>;
  status?: BoardStatus | null;
  titen?: ReturnType<typeof useTiten> | null;
};

/** The whole board, from plain data (also what a preview/demo renders). */
export function BoardView({ settings, tasks, days, wins, error, online, now, name, onSettings, reserved, ci = null, status = null, titen = null }: ViewProps) {

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

  const alerts: Nudge[] = [
    ...(status?.apps ?? [])
      .filter((a) => a.ok && !a.schedulerAlive)
      .map((a) => ({ tone: "warn" as const, text: `${a.name} scheduler stopped: scheduled pushes and jobs aren't running. Check cron-job.org.` })),
    ...(status?.deploys?.failed ?? []).map((d) => ({ tone: "warn" as const, text: `${d.project}: the latest production deploy failed. Open Vercel and check the build log.` })),
  ];
  const nudges = buildNudges({ tasks, habits: settings.habits, habitsDoneToday, lastLearn, now, alerts });

  const mood: TitenMood = titen?.mood ?? "offline";
  const focusClass = (card: "pipes" | "apps") => (!titen?.focus ? "" : titen.focus === card ? "board-live" : "board-dim");
  const idleLine = nudges[0]?.text ?? "All quiet. Ask me anything, or say “Hey Titen”.";

  return (
    <Shell mood={mood}>
      <div style={reserved && (reserved.left || reserved.right) ? { marginLeft: reserved.left, marginRight: reserved.right, maxWidth: "none" } : undefined} className="board-frame mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col gap-5 px-5 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))] sm:px-8 lg:gap-6 lg:px-12 lg:pb-8 lg:pt-8">
        <header className="flex items-start justify-between gap-6">
          <Clock now={now} name={name} extra={settings.countdown && <CountdownChip label={settings.countdown.label} date={settings.countdown.date} now={now} />} />
          <div className="flex flex-col items-end gap-4">
            <div className="flex items-center gap-2 pt-2">
              <span className={`mono-label flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] ${online && !error ? "border-mint/20 text-mint/90" : "border-amber-300/30 text-amber-300"}`}>
                <span className={`size-1.5 rounded-full ${online && !error ? "animate-pulse bg-mint" : "bg-amber-300"}`} />
                {error ? "Sync error" : online ? "Live" : "Offline"}
              </span>
              <button onClick={onSettings} aria-label="Board settings" className="grid size-9 place-items-center rounded-full border border-white/[0.07] text-ink-faint transition-colors hover:border-white/20 hover:text-ink">
                <Settings2 size={16} />
              </button>
            </div>
            <div className={focusClass("apps")}><AppsStrip apps={status?.apps} /></div>
          </div>
        </header>

        {error && <p className="rounded-2xl border border-amber-300/30 bg-amber-300/[0.06] px-4 py-3 text-sm text-amber-100">{error}</p>}

        <div className="grid min-h-0 grid-cols-1 content-start gap-5 lg:grid-cols-12 lg:gap-6">
          {/* left column runs the full height; Titen + pipelines/log on top, habits under them,
              so no column leaves a hole under it */}
          <div className="order-2 flex min-h-0 flex-col gap-5 lg:order-1 lg:col-span-4 lg:row-span-2 lg:gap-6">
            <FocusCard tasks={tasks} now={now} />
            {/* when Titen is up it already says the first nudge, so don't repeat it here */}
            <Nudges nudges={titen?.online && mood !== "sleep" ? nudges.slice(1) : nudges} />
            <WinsCard tasks={tasks} wins={wins} learnDays={learnDays} now={now} limit={8} className="lg:flex-1" />
          </div>
          <div className="order-1 flex min-h-0 items-start justify-center pt-2 lg:order-2 lg:col-span-4">
            <TitenCore
              mood={mood}
              configured={!!titen?.configured}
              heard={titen?.heard ?? ""}
              reply={titen?.reply ?? ""}
              steps={titen?.steps ?? []}
              privateMode={titen?.privateMode}
              onAsk={(t) => titen?.ask(t)}
              idleLine={idleLine}
              titenUrl={settings.titenUrl}
              why={titen?.why}
            />
          </div>
          <div className="order-3 flex min-h-0 flex-col gap-5 lg:col-span-4 lg:gap-6">
            <div className={`flex min-h-0 flex-col ${focusClass("pipes")}`}><PipelinesCard ci={ci} deploys={status?.deploys} now={now} /></div>
            <TitenLog items={titen?.log ?? []} online={!!titen?.online} className="lg:flex-1" />
          </div>
          <div className="order-4 min-w-0 lg:col-span-8 lg:col-start-5">
            <HabitsCard habits={settings.habits} days={days} gymDays={gymDays} now={now} />
          </div>
        </div>

        <Reminder lines={settings.reminders} />
      </div>
    </Shell>
  );
}

function Clock({ now, name, extra }: { now: Date; name: string; extra?: React.ReactNode }) {
  const time = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  const [hm, ampm] = time.split(" ");
  return (
    <div>
      <p className="mono-label text-[11px] text-ink-faint">
        {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
      </p>
      <h1 className="mt-1 flex items-baseline gap-3 font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-ink">
        <span className="text-[clamp(56px,min(7.5vw,11vh),128px)] tabular-nums">{hm}</span>
        <span className="font-mono text-[clamp(14px,1.2vw,20px)] font-medium uppercase tracking-normal text-ink-faint">{ampm}</span>
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-[clamp(15px,1.25vw,20px)] text-ink-soft">
          {greeting(now.getHours())}, <span className="text-gradient font-semibold">{name}</span>. One thing at a time.
        </p>
        {extra}
      </div>
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

function CountdownChip({ label, date, now }: { label: string; date: string; now: Date }) {
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const days = daysBetween(now, new Date(y, m - 1, d));
  if (days < 0) return null; // the day has passed: hide it instead of counting up
  const text = days > 1 ? `${days} days` : days === 1 ? "tomorrow" : "today";
  return (
    <p className="mono-label inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/[0.08] px-3 py-1.5 text-[11px] text-violet">
      <span className="size-1.5 rounded-full bg-violet" />
      {label} · <span className="text-ink">{text}</span>
    </p>
  );
}
