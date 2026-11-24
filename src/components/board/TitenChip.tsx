"use client";

import { useEffect, useState } from "react";

// Titen (Arun's voice assistant) runs on his Mac and is reachable only inside his Tailscale network.
// This chip asks the Mac what Titen is doing every few seconds and opens Titen's chat when tapped.
// On a device outside Tailscale (or with the Mac asleep) it simply shows "off", and nothing leaks:
// the board never sends anything to Titen except this status read.

type Status = { state?: string; tool?: string; wake?: string; paused?: boolean; mode?: string };

const LABEL: Record<string, string> = {
  idle: "ready", detecting: "hearing…", listening: "listening", hearing: "hearing", thinking: "thinking",
  writing: "replying", voicing: "voice…", speaking: "speaking", paused: "paused",
};
const TONE: Record<string, string> = {
  listening: "bg-cyan-300", hearing: "bg-cyan-300", detecting: "bg-cyan-300",
  thinking: "bg-violet", writing: "bg-violet", tool: "bg-violet", voicing: "bg-violet", speaking: "bg-pink-400",
};

export default function TitenChip({ url }: { url?: string }) {
  const [st, setSt] = useState<Status | null>(null);
  const [off, setOff] = useState(false);

  useEffect(() => {
    if (!url) return;
    let alive = true;
    const load = async () => {
      try {
        const res = await fetch(`${url}/api/status`, { cache: "no-store", signal: AbortSignal.timeout(3000) });
        if (!res.ok) throw new Error(String(res.status));
        const d = (await res.json()) as Status;
        if (alive) {
          setSt(d);
          setOff(false);
        }
      } catch {
        if (alive) setOff(true);
      }
    };
    load();
    const t = setInterval(load, 3000);
    return () => {
      alive = false;
      clearInterval(t);
    };
  }, [url]);

  if (!url) return null;
  const state = off ? "off" : st?.paused ? "paused" : st?.state || "idle";
  const word = off
    ? "off"
    : state === "tool"
      ? st?.tool === "web_search" ? "searching" : "working"
      : LABEL[state] ?? state;
  const busy = !off && state !== "idle" && state !== "paused";
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      title={off ? "Titen isn't reachable: Mac asleep, Titen stopped, or this device isn't on Tailscale" : "Open Titen"}
      className={`mono-label flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] transition-colors hover:border-white/25 ${
        off ? "border-white/[0.07] text-ink-faint" : "border-violet/30 text-ink-soft"
      }`}
    >
      <span className={`size-1.5 rounded-full ${off ? "bg-white/25" : TONE[state] ?? "bg-mint"} ${busy ? "animate-pulse" : ""}`} />
      Titen · {word}
      {st?.mode === "private" && !off ? " · 🔒" : ""}
    </a>
  );
}
