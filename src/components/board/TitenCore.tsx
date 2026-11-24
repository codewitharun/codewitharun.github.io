"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import type { TitenMood, TitenStep } from "./useTiten";

export const DINO =
  "M88.8969 74.9147C123.041 64.9409 188.485 56.3963 246.814 74.9161C260.33 111.234 266.732 129.75 271 172.484C240.385 206.888 230.074 220.413 187.047 247L183.208 167.728H209.48L224.127 152.829L191.345 141.423L207.737 136.769L216.938 134.506L224.127 138.779V132.113L216.223 112.094H153.914L108.605 218.172C91.4117 204.445 76.3134 189.743 64 172.484C67.5567 139.72 73.2475 114.081 88.8969 74.9147ZM128.272 127.964L136.5 138.922L141.864 126.31L128.272 127.964ZM134.621 114.227L142.77 125.37L148.292 112.386L134.621 114.227ZM201.009 108.138H214.701L207.856 96.2663L201.009 108.138ZM170.352 107.672H184.446L177.399 95.8017L170.352 107.672ZM185.695 107.672H199.79L192.741 95.8017L185.695 107.672ZM155.439 107.206H169.131L162.284 95.3357L155.439 107.206Z";
const EYE =
  "M192.045 122.104C192.045 123.523 191.407 124.885 190.274 125.889C189.14 126.893 187.603 127.456 186 127.456C184.397 127.456 182.859 126.893 181.725 125.889C180.592 124.885 179.956 123.523 179.955 122.104H192.045Z";

const LABEL: Record<TitenMood, string> = {
  offline: "offline", sleep: "asleep", idle: "ready", listen: "listening", think: "thinking", talk: "speaking", alert: "heads up",
};
const SUGGEST = ["Check pipelines", "Brief me", "How is FitPrep doing?"];

const SPEED: Record<TitenMood, number> = { offline: 0.04, sleep: 0.02, idle: 0.18, listen: 0.45, think: 1.1, talk: 0.6, alert: 0.9 };

/** A rotating 3D globe of points with links between near neighbours, drawn inside the core's rings. */
function MeshSphere({ mood }: { mood: TitenMood }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const moodRef = useRef(mood);
  useEffect(() => { moodRef.current = mood; }, [mood]);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const N = 90;
    const golden = Math.PI * (3 - Math.sqrt(5));
    const pts = Array.from({ length: N }, (_, i) => {
      const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), t = golden * i;
      return [Math.cos(t) * r, y, Math.sin(t) * r] as const;
    });
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0, raf = 0, last = performance.now(), color = "94,234,212";

    const readColor = () => {
      const v = getComputedStyle(canvas).getPropertyValue("--tc-acc").trim();
      const m = v.match(/^#([0-9a-f]{6})$/i);
      if (m) color = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16)).join(",");
    };

    const draw = (now: number) => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const size = canvas.clientWidth;
      if (canvas.width !== Math.round(size * dpr)) { canvas.width = canvas.height = Math.round(size * dpr); }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);
      readColor();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!still) angle += dt * SPEED[moodRef.current];
      const R = size * 0.46, c = size / 2, tilt = 0.35;
      const ca = Math.cos(angle), sa = Math.sin(angle), ct = Math.cos(tilt), st = Math.sin(tilt);
      const proj = pts.map(([x, y, z]) => {
        const x1 = x * ca + z * sa, z1 = -x * sa + z * ca;
        const y2 = y * ct - z1 * st, z2 = y * st + z1 * ct;
        return [c + x1 * R, c + y2 * R, z2] as const;
      });
      ctx.lineWidth = 0.8;
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = pts[i][0] - pts[j][0], dy = pts[i][1] - pts[j][1], dz = pts[i][2] - pts[j][2];
          if (dx * dx + dy * dy + dz * dz > 0.16) continue;
          const depth = (proj[i][2] + proj[j][2]) / 2;
          ctx.strokeStyle = `rgba(${color},${(0.12 + (depth + 1) * 0.24).toFixed(3)})`;
          ctx.beginPath();
          ctx.moveTo(proj[i][0], proj[i][1]);
          ctx.lineTo(proj[j][0], proj[j][1]);
          ctx.stroke();
        }
      }
      for (const [x, y, z] of proj) {
        const a = 0.25 + (z + 1) * 0.37;
        ctx.fillStyle = `rgba(${color},${a.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + (z + 1) * 1.3, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!still) raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    const onVis = () => {
      cancelAnimationFrame(raf);
      if (!document.hidden) { last = performance.now(); raf = requestAnimationFrame(draw); }
    };
    document.addEventListener("visibilitychange", onVis);
    return () => { cancelAnimationFrame(raf); document.removeEventListener("visibilitychange", onVis); };
  }, []);

  return <canvas ref={ref} className="tc-mesh" aria-hidden />;
}

type Props = {
  mood: TitenMood;
  configured: boolean;
  heard: string;
  reply: string;
  steps: TitenStep[];
  privateMode?: boolean;
  onAsk: (text: string) => void;
  idleLine: string;
  titenUrl?: string;
};

export default function TitenCore({ mood, configured, heard, reply, steps, privateMode, onAsk, idleLine, titenUrl }: Props) {
  const [draft, setDraft] = useState("");
  const offline = mood === "offline" || mood === "sleep";
  const line = mood === "sleep"
    ? "I'm asleep. Mic off, nothing running. Wake me from Titen's page."
    : mood === "offline"
      ? configured ? "I'm offline. The Mac is asleep, Titen is stopped, or this device isn't on Tailscale." : "Add Titen's Tailscale address in settings to bring me here."
      : reply || idleLine;

  const send = (text: string) => {
    if (!text.trim() || offline) return;
    onAsk(text);
    setDraft("");
  };

  return (
    <section className="tc relative flex flex-col items-center gap-4" aria-label={`Titen, ${LABEL[mood]}`}>
      <a href={titenUrl || undefined} target="_blank" rel="noreferrer" className="tc-core" title={titenUrl ? "Open Titen" : undefined}>
        <span className="tc-orbit" />
        <span className="tc-dots tc-dots-b" />
        <span className="tc-dots" />
        <span className="tc-halo" />
        <MeshSphere mood={mood} />
        <span className="tc-disc" />
        <span className="tc-bob">
          <svg width="92" height="78" viewBox="60 71 207 176" aria-hidden>
            <path className="tc-body" fillRule="evenodd" clipRule="evenodd" d={DINO} />
            <path className="tc-eye" d={EYE} />
          </svg>
        </span>
      </a>

      <div className="tc-wave" aria-hidden>
        {Array.from({ length: 20 }, (_, i) => <span key={i} style={{ animationDelay: `${(i % 5) * 0.07}s` }} />)}
      </div>

      <div className="min-h-[64px] max-w-[460px] text-center">
        <p className="mono-label text-[11px]" style={{ color: "var(--tc-acc)" }}>
          Titen · {LABEL[mood]}{privateMode && !offline ? " · private" : ""}
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={heard + (reply ? "r" : "") + mood}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={`mt-2 font-display text-[clamp(17px,1.45vw,22px)] font-medium leading-snug text-ink line-clamp-4 ${mood === "talk" ? "tc-caret" : ""}`}
          >
            {mood === "listen" || (mood === "think" && !reply) ? (heard ? `“${heard}”` : "Listening…") : line}
          </motion.p>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {steps.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex min-w-[280px] flex-col gap-2 rounded-2xl border border-white/[0.07] bg-black/30 px-4 py-3"
          >
            {steps.slice(-4).map((s) => (
              <li key={s.id} className="flex items-center gap-2.5 text-[13px] text-ink-soft">
                {s.done ? <span className="tc-okdot" /> : <span className="tc-spin" />}
                {s.text}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <form
        onSubmit={(e) => { e.preventDefault(); send(draft); }}
        className="tc-ask mt-1 w-full max-w-[520px]"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={mood === "sleep" ? "Titen is asleep" : offline ? "Titen is offline" : "Ask Titen anything…"}
          disabled={offline}
          aria-label="Ask Titen"
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-faint disabled:opacity-60"
        />
        <span className="mono-label hidden text-[10px] text-ink-faint/70 sm:inline">or say “Hey Titen”</span>
        <button type="submit" disabled={offline || !draft.trim()} aria-label="Send to Titen" className="tc-send">
          <ArrowUp size={16} strokeWidth={2.6} />
        </button>
      </form>
      {!offline && (
        <div className="flex flex-wrap justify-center gap-2">
          {SUGGEST.map((s) => (
            <button key={s} onClick={() => send(s)} className="tc-chip">{s}</button>
          ))}
        </div>
      )}
    </section>
  );
}
