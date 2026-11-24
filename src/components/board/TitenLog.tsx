"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { TitenLogItem } from "./useTiten";

const DOT: Record<TitenLogItem["tone"], string> = {
  titen: "#a78bfa", you: "#67e8f9", good: "#5eead4", bad: "#fb7185", info: "#fbbf24",
};

/** What Titen heard and did lately, newest first. */
export default function TitenLog({ items, online }: { items: TitenLogItem[]; online: boolean }) {
  return (
    <section className="board-card flex min-h-0 flex-col overflow-hidden">
      <header className="flex items-center justify-between">
        <p className="mono-label text-[11px] text-ink-faint">Titen log</p>
        <p className="mono-label text-[10px]" style={{ color: online ? "var(--tc-acc)" : undefined }}>{online ? "● live" : "offline"}</p>
      </header>
      <ul className="mt-3 flex min-h-0 flex-col gap-0.5 overflow-hidden [mask-image:linear-gradient(to_bottom,black_80%,transparent)]">
        {!items.length && <li className="py-1 text-sm text-ink-faint">{online ? "Nothing yet. Say “Hey Titen”." : "Titen's activity shows here when it's reachable."}</li>}
        <AnimatePresence initial={false}>
          {items.slice(0, 5).map((it) => (
            <motion.li
              key={it.id}
              layout
              initial={{ opacity: 0, x: -12, backgroundColor: "rgba(94,234,212,0.12)" }}
              animate={{ opacity: 1, x: 0, backgroundColor: "rgba(0,0,0,0)" }}
              transition={{ duration: 0.6 }}
              className="flex gap-3 rounded-xl px-2 py-2"
            >
              <span className="mt-1.5 size-2 shrink-0 rounded-full" style={{ background: DOT[it.tone], boxShadow: `0 0 8px ${DOT[it.tone]}` }} />
              <span className="min-w-0">
                <span className="block truncate text-[14px] text-ink">{it.text}</span>
                <span className="mono-label mt-0.5 block text-[10px] text-ink-faint">{it.meta}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
