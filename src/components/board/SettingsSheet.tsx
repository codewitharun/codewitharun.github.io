"use client";

import { useState } from "react";
import { LogOut, Plus, Trash2, X } from "lucide-react";
import { saveSettings, type BoardSettings } from "@/lib/board";

export default function SettingsSheet({ settings, onClose, onLogout }: { settings: BoardSettings; onClose: () => void; onLogout: () => void }) {
  const [habits, setHabits] = useState(settings.habits);
  const [reminders, setReminders] = useState(settings.reminders.join("\n"));
  const [cdLabel, setCdLabel] = useState(settings.countdown?.label ?? "");
  const [cdDate, setCdDate] = useState(settings.countdown?.date ?? "");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    await saveSettings({
      habits: habits.map((h) => ({ ...h, label: h.label.trim() })).filter((h) => h.label),
      reminders: reminders.split("\n").map((r) => r.trim()).filter(Boolean),
      countdown: cdDate ? { label: cdLabel.trim() || "Countdown", date: cdDate } : null,
    });
    setSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[120] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-lg rounded-[28px] border border-white/10 bg-bg-card p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Board settings</h2>
          <button onClick={onClose} aria-label="Close" className="grid size-9 place-items-center rounded-full text-ink-faint hover:bg-white/5 hover:text-ink">
            <X size={18} />
          </button>
        </div>

        <p className="mono-label mt-6 text-[11px] text-ink-faint">Habits (max 4)</p>
        <p className="mt-1 text-xs text-ink-faint">A habit with the id &quot;learn&quot; ticks itself when you pass a JS Gym exercise.</p>
        <div className="mt-3 flex flex-col gap-2">
          {habits.map((h, i) => (
            <div key={h.id} className="flex items-center gap-2">
              <input
                value={h.label}
                onChange={(e) => setHabits(habits.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
                maxLength={40}
                className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-ink outline-none focus:border-mint"
              />
              <button onClick={() => setHabits(habits.filter((_, j) => j !== i))} aria-label="Remove habit" className="grid size-9 place-items-center rounded-xl text-ink-faint hover:bg-white/5 hover:text-red-300">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
          {habits.length < 4 && (
            <button
              onClick={() => setHabits([...habits, { id: `h${Date.now().toString(36)}`, label: "" }])}
              className="flex items-center gap-2 self-start rounded-xl px-2 py-1.5 text-sm text-mint hover:bg-mint/10"
            >
              <Plus size={15} /> Add habit
            </button>
          )}
        </div>

        <p className="mono-label mt-6 text-[11px] text-ink-faint">Reminders (one per line, they rotate)</p>
        <textarea
          value={reminders}
          onChange={(e) => setReminders(e.target.value)}
          rows={5}
          className="mt-2 w-full resize-none rounded-xl border border-border bg-bg px-3 py-2.5 text-sm leading-relaxed text-ink outline-none focus:border-mint"
        />

        <p className="mono-label mt-6 text-[11px] text-ink-faint">Countdown (optional)</p>
        <div className="mt-2 flex gap-2">
          <input
            value={cdLabel}
            onChange={(e) => setCdLabel(e.target.value)}
            placeholder="Trip ends, launch, exam…"
            maxLength={40}
            className="min-w-0 flex-1 rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-ink outline-none focus:border-mint"
          />
          <input
            type="date"
            value={cdDate}
            onChange={(e) => setCdDate(e.target.value)}
            className="rounded-xl border border-border bg-bg px-3 py-2.5 text-sm text-ink outline-none [color-scheme:dark] focus:border-mint"
          />
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <button onClick={onLogout} className="flex items-center gap-2 rounded-full px-3 py-2 text-sm text-ink-faint hover:bg-white/5 hover:text-ink">
            <LogOut size={15} /> Sign out
          </button>
          <button onClick={save} disabled={saving} className="rounded-full bg-mint px-5 py-2.5 text-sm font-semibold text-bg disabled:opacity-60">
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
