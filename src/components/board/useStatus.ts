"use client";

import { useEffect, useState } from "react";
import type { User } from "firebase/auth";
import type { AppStat, Deploy } from "@/app/api/board/status/route";

export type BoardStatus = {
  apps: AppStat[] | null;
  deploys: { building: Deploy[]; failed: Deploy[] } | null;
  deployError?: string;
};

/** App stats + Vercel deploys: every 20 s while something deploys, else every minute. */
export function useStatus(user: User | null) {
  const [status, setStatus] = useState<BoardStatus | null>(null);
  useEffect(() => {
    if (!user) return;
    let alive = true;
    let timer: ReturnType<typeof setTimeout>;
    const load = async () => {
      let next = 60_000;
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/board/status", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as BoardStatus;
          if (!alive) return;
          setStatus(data);
          if (data.deploys?.building.length) next = 20_000;
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
  return status;
}
