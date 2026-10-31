"use client";

import type { AppStat } from "@/app/api/board/status/route";

const ACCENT: Record<string, string> = { fitprep: "from-lime-300 to-mint", ezysplit: "from-sky-300 to-teal-300" };

/** Compact live tiles for FitPrep / EzySplit in the header: users, today, new, Pro/groups, scheduler. */
export default function AppsStrip({ apps }: { apps: AppStat[] | null | undefined }) {
  if (!apps?.length) return null;
  return (
    <div className="hidden flex-wrap justify-end gap-3 md:flex">
      {apps.map((a) => (
        <div key={a.id} className="min-w-[230px] rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-3">
            <p className={`bg-gradient-to-r bg-clip-text font-display text-[15px] font-bold text-transparent ${ACCENT[a.id] ?? "from-mint to-violet"}`}>{a.name}</p>
            {a.ok ? (
              <span
                title={a.schedulerAlive ? "Scheduler running" : `Scheduler stopped${a.schedulerLastTickAt ? ` (last ${new Date(a.schedulerLastTickAt).toLocaleString("en-IN")})` : ""}`}
                className={`mono-label flex items-center gap-1.5 text-[9px] ${a.schedulerAlive ? "text-ink-faint" : "text-amber-300"}`}
              >
                <span className={`size-1.5 rounded-full ${a.schedulerAlive ? "bg-mint" : "animate-pulse bg-amber-300"}`} />
                {a.schedulerAlive ? "cron ok" : "cron stopped"}
              </span>
            ) : (
              <span className="mono-label text-[9px] text-amber-300">{a.error}</span>
            )}
          </div>
          {a.ok && (
            <div className="mt-2 grid grid-cols-4 gap-2">
              <Stat n={a.users} label="users" />
              <Stat n={a.active1} label="today" />
              <Stat n={a.new7} label="new 7d" />
              {a.id === "fitprep" ? <Stat n={a.pro} label="pro" /> : <Stat n={a.groups ?? undefined} label="groups" />}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Stat({ n, label }: { n?: number; label: string }) {
  return (
    <div>
      <p className="font-display text-[20px] font-extrabold leading-none tabular-nums text-ink">{n ?? "–"}</p>
      <p className="mono-label mt-1 text-[8.5px] text-ink-faint">{label}</p>
    </div>
  );
}
