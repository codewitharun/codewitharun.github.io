"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  DEFAULT_SETTINGS,
  watchDays,
  watchSettings,
  watchTasks,
  type BoardDays,
  type BoardSettings,
  type BoardTask,
} from "@/lib/board";
import { addDays, dayKey } from "./dates";

export type Wins = {
  configured: boolean;
  gym: { id: string; kind: "tests" | "edge cases"; at: string }[];
  prs: { title: string; url: string; repo: string; at: string }[];
};

export const GRID_DAYS = 7 * 26; // habit grid: 26 weeks (half a year)

/** Live board data for the signed-in admin. Firestore listeners sync every device instantly. */
export function useBoard(user: User | null) {
  const [settings, setSettings] = useState<BoardSettings>(DEFAULT_SETTINGS);
  const [tasks, setTasks] = useState<BoardTask[]>([]);
  const [days, setDays] = useState<BoardDays>({});
  const [wins, setWins] = useState<Wins | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [online, setOnline] = useState(true);

  const fromKey = useMemo(() => dayKey(addDays(new Date(), -GRID_DAYS - 7)), []);

  useEffect(() => {
    if (!user) return;
    const fail = (e: Error) => setError(e.message.includes("permission") ? "No access: check the board rules in Firestore." : e.message);
    const unsubs = [
      watchSettings(setSettings, fail),
      watchTasks((t) => {
        setTasks(t);
        setReady(true);
      }, fail),
      watchDays(fromKey, setDays, fail),
    ];
    return () => unsubs.forEach((u) => u());
  }, [user, fromKey]);

  // Auto wins from GitHub (JS Gym passes, merged PRs): every 10 minutes.
  useEffect(() => {
    if (!user) return;
    let alive = true;
    const load = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch("/api/board/wins", { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
        if (res.ok && alive) setWins(await res.json());
      } catch {
        /* keep the last wins; the board still works without them */
      }
    };
    load();
    const t = setInterval(load, 10 * 60_000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [user]);

  useEffect(() => {
    const on = () => setOnline(navigator.onLine);
    on();
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
    };
  }, []);

  return { settings, tasks, days, wins, error, ready, online };
}

/** Re-render every minute (clock, "today", ages). Also rolls over at midnight. */
export function useNow(intervalMs = 30_000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(t);
  }, [intervalMs]);
  return now;
}
