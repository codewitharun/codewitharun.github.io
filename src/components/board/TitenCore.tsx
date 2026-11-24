"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import type { TitenMood, TitenStep } from "./useTiten";

export const DINO =
  "M88.8969 74.9147C123.041 64.9409 188.485 56.3963 246.814 74.9161C260.33 111.234 266.732 129.75 271 172.484C240.385 206.888 230.074 220.413 187.047 247L183.208 167.728H209.48L224.127 152.829L191.345 141.423L207.737 136.769L216.938 134.506L224.127 138.779V132.113L216.223 112.094H153.914L108.605 218.172C91.4117 204.445 76.3134 189.743 64 172.484C67.5567 139.72 73.2475 114.081 88.8969 74.9147ZM128.272 127.964L136.5 138.922L141.864 126.31L128.272 127.964ZM134.621 114.227L142.77 125.37L148.292 112.386L134.621 114.227ZM201.009 108.138H214.701L207.856 96.2663L201.009 108.138ZM170.352 107.672H184.446L177.399 95.8017L170.352 107.672ZM185.695 107.672H199.79L192.741 95.8017L185.695 107.672ZM155.439 107.206H169.131L162.284 95.3357L155.439 107.206Z";
const EYE =
  "M192.045 122.104C192.045 123.523 191.407 124.885 190.274 125.889C189.14 126.893 187.603 127.456 186 127.456C184.397 127.456 182.859 126.893 181.725 125.889C180.592 124.885 179.956 123.523 179.955 122.104H192.045Z";

const LABEL: Record<TitenMood, string> = {
  offline: "offline", idle: "ready", listen: "listening", think: "thinking", talk: "speaking", alert: "heads up",
};
const SUGGEST = ["Check pipelines", "Brief me", "How is FitPrep doing?"];

/** A fixed, seeded neural web around the core: synapses with light travelling along them. */
const NET = (() => {
  {
    let seed = 7;
    const rnd = () => ((seed = (seed * 9301 + 49297) % 233280), seed / 233280);
    const cx = 360, cy = 200;
    const nodes = Array.from({ length: 18 }, () => {
      const a = rnd() * Math.PI * 2, r = 170 + rnd() * 170;
      return { x: cx + Math.cos(a) * r * 1.05, y: cy + Math.sin(a) * r * 0.62, r: 1.5 + rnd() * 2 };
    });
    const lines: { d: string; delay: string }[] = [];
    nodes.forEach((n, i) => {
      if (i % 2 === 0) {
        const mx = (n.x + cx) / 2 + (rnd() - 0.5) * 80, my = (n.y + cy) / 2 + (rnd() - 0.5) * 80;
        lines.push({ d: `M${cx} ${cy} Q${mx.toFixed(0)} ${my.toFixed(0)} ${n.x.toFixed(0)} ${n.y.toFixed(0)}`, delay: `${(-rnd() * 4).toFixed(2)}s` });
      }
      if (i % 3 === 0) {
        const m = nodes[(i + 3) % nodes.length];
        lines.push({ d: `M${n.x.toFixed(0)} ${n.y.toFixed(0)} L${m.x.toFixed(0)} ${m.y.toFixed(0)}`, delay: `${(-rnd() * 4).toFixed(2)}s` });
      }
    });
    return { nodes, lines };
  }
})();

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
  const net = NET;
  const [draft, setDraft] = useState("");
  const offline = mood === "offline";
  const line = offline
    ? configured ? "I'm offline. The Mac is asleep, Titen is stopped, or this device isn't on Tailscale." : "Add Titen's Tailscale address in settings to bring me here."
    : reply || idleLine;

  const send = (text: string) => {
    if (!text.trim() || offline) return;
    onAsk(text);
    setDraft("");
  };

  return (
    <section className="tc relative flex flex-col items-center gap-4" aria-label={`Titen, ${LABEL[mood]}`}>
      <svg className="tc-field" viewBox="0 0 720 520" aria-hidden>
        {net.lines.map((l, i) => (
          <g key={i}>
            <path className="tc-syn" d={l.d} />
            <path className="tc-pulse" d={l.d} pathLength={126} style={{ animationDelay: l.delay }} />
          </g>
        ))}
        {net.nodes.map((n, i) => <circle key={i} className="tc-node" cx={n.x} cy={n.y} r={n.r} />)}
      </svg>

      <a href={titenUrl || undefined} target="_blank" rel="noreferrer" className="tc-core" title={titenUrl ? "Open Titen" : undefined}>
        <span className="tc-orbit" />
        <span className="tc-dots tc-dots-b" />
        <span className="tc-dots" />
        <span className="tc-halo" />
        <span className="tc-disc" />
        <span className="tc-bob">
          <svg width="116" height="98" viewBox="60 71 207 176" aria-hidden>
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
          placeholder={offline ? "Titen is offline" : "Ask Titen anything…"}
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
