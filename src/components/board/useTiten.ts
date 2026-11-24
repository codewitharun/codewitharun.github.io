"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Titen (Arun's voice assistant) runs on his Mac, reachable only inside his Tailscale network.
// The board follows Titen's live events (what it hears, says and does) and can ask it something.
// Outside Tailscale, or with the Mac asleep, everything here quietly shows "offline".

export type TitenMood = "offline" | "sleep" | "idle" | "listen" | "think" | "talk" | "alert";
export type TitenStep = { id: string; text: string; done: boolean };
export type TitenLogItem = { id: string; text: string; meta: string; tone: "titen" | "you" | "good" | "bad" | "info"; at: number };

type Turn = { id: number; ts: number; request: string; reply: string; source: string; steps: { tool: string }[] };

const TOOL_WORDS: Record<string, string> = {
  web_search: "Searching the web", web_fetch: "Reading a page", pipeline_status: "Reading GitHub Actions",
  watch_pipeline: "Watching the pipeline", fitprep_stats: "Checking FitPrep", ezysplit_stats: "Checking EzySplit",
  notion_tasks: "Reading Notion tasks", notion_add_task: "Preparing a Notion task", recall: "Checking memory",
  remember: "Saving to memory", repo_status: "Checking your repos", play_music: "Finding the song",
  code_task: "Handing it to Claude Code", jsgym_progress: "Checking JS Gym", set_reminder: "Setting a reminder",
};
/** Which board card a tool is about, so the board can light that card up. */
export const TOOL_FOCUS: Record<string, "pipes" | "apps"> = {
  pipeline_status: "pipes", watch_pipeline: "pipes", fitprep_stats: "apps", ezysplit_stats: "apps",
};

const clean = (s: string) => s.split("[What I actually did:")[0].trim();
const sourceWord = (s: string) => (s === "hey titen" ? "voice" : s === "board" ? "board" : s || "chat");

export function useTiten(url?: string) {
  const [online, setOnline] = useState(false);
  const [state, setState] = useState("idle");
  const [heard, setHeard] = useState("");
  const [reply, setReply] = useState("");
  const [steps, setSteps] = useState<TitenStep[]>([]);
  const [focus, setFocus] = useState<"pipes" | "apps" | null>(null);
  const [alert, setAlert] = useState(false);
  const [log, setLog] = useState<TitenLogItem[]>([]);
  const [privateMode, setPrivateMode] = useState(false);
  const settle = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const push = useCallback((item: Omit<TitenLogItem, "id" | "at">) => {
    setLog((l) => [{ ...item, id: Math.random().toString(36).slice(2), at: Date.now() }, ...l].slice(0, 30));
  }, []);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    let es: EventSource | null = null;

    fetch(`${url}/api/history?limit=6`, { cache: "no-store", signal: AbortSignal.timeout(4000) })
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { turns: Turn[] } | null) => {
        if (!alive || !d) return;
        const last = d.turns[d.turns.length - 1];
        if (last) setReply(clean(last.reply));
        setLog(d.turns.slice().reverse().map((t) => ({
          id: `h${t.id}`, at: t.ts * 1000, tone: "titen" as const, text: t.request || clean(t.reply).slice(0, 90),
          meta: `${sourceWord(t.source)} · ${new Date(t.ts * 1000).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`,
        })));
      })
      .catch(() => {});

    const open = () => {
      es = new EventSource(`${url}/api/events`);
      es.onopen = () => alive && setOnline(true);
      es.onerror = () => alive && setOnline(false);
      es.onmessage = (m) => {
        if (!alive) return;
        let ev: Record<string, unknown>;
        try { ev = JSON.parse(m.data); } catch { return; }
        const type = (ev.type as string) || "status";
        if (type === "status") {
          setState(String(ev.state || "idle"));
          if (ev.mode) setPrivateMode(ev.mode === "private");
          if (ev.state === "idle") {
            clearTimeout(settle.current);
            settle.current = setTimeout(() => { setSteps([]); setFocus(null); setAlert(false); }, 6000);
          }
        } else if (type === "user") {
          clearTimeout(settle.current);
          setHeard(String(ev.text || "")); setReply(""); setSteps([]); setAlert(false); setFocus(null);
          push({ tone: "you", text: String(ev.text || ""), meta: `you · ${sourceWord(String(ev.source || ""))}` });
        } else if (type === "delta") {
          setReply((r) => clean(r + String(ev.text || "")));
        } else if (type === "tool") {
          const tool = String(ev.tool || "");
          setReply("");
          setFocus(TOOL_FOCUS[tool] ?? null);
          setSteps((s) => [...s.map((x) => ({ ...x, done: true })), { id: `${tool}${s.length}`, text: TOOL_WORDS[tool] ?? `Using ${tool.replace(/_/g, " ")}`, done: false }]);
        } else if (type === "tool_result") {
          setSteps((s) => s.map((x) => ({ ...x, done: true })));
        } else if (type === "done") {
          const turn = ev.turn as Turn | undefined;
          setSteps((s) => s.map((x) => ({ ...x, done: true })));
          if (turn?.reply) setReply(clean(turn.reply));
        } else if (type === "notice") {
          const text = String(ev.text || "");
          const bad = /❌|failed|fail/i.test(text);
          setAlert(bad);
          if (/pipeline/i.test(text)) setFocus("pipes");
          setReply(text.replace(/^[^\w]+/, ""));
          push({ tone: bad ? "bad" : /✅|passed/.test(text) ? "good" : "info", text: text.replace(/^[^\w]+/, ""), meta: "titen · just now" });
        }
      };
    };
    open();
    return () => {
      alive = false;
      es?.close();
      clearTimeout(settle.current);
    };
  }, [url, push]);

  const ask = useCallback(async (text: string) => {
    if (!url || !text.trim()) return;
    try {
      await fetch(`${url}/api/ask`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim(), session: "board", voice: false }),
      });
    } catch {
      setOnline(false);
    }
  }, [url]);

  const mood: TitenMood = !url || !online ? "offline"
    : state === "asleep" ? "sleep"
    : alert ? "alert"
    : ["listening", "hearing", "detecting"].includes(state) ? "listen"
    : ["thinking", "tool"].includes(state) ? "think"
    : ["writing", "voicing", "speaking"].includes(state) ? "talk"
    : "idle";

  return { configured: !!url, online, mood, state, heard, reply, steps, focus, log, ask, privateMode };
}
