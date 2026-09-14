"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { submitContactMessage } from "@/lib/messages";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-border bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-faint focus:border-mint/60";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: a field real visitors never see or fill (hidden off-screen,
    // not display:none — some bots skip display:none fields specifically,
    // so this is positioned off-canvas instead). Any value here means a
    // bot filled every field it could find; silently pretend success so
    // it doesn't learn to route around the check.
    if ((data.get("company") as string)?.trim()) {
      setStatus("success");
      form.reset();
      return;
    }

    const name = (data.get("name") as string)?.trim();
    const email = (data.get("email") as string)?.trim();
    const phone = (data.get("phone") as string)?.trim();
    const message = (data.get("message") as string)?.trim();

    if (!name || !email || !phone || !message) {
      setStatus("error");
      setErrorMessage("Fill in every field so there's a way to get back to you.");
      return;
    }

    setStatus("submitting");
    setErrorMessage(null);
    try {
      await submitContactMessage({ name, email, phone, message });
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong sending that — try again, or email directly instead.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-mint/30 bg-mint/10 p-8 text-center">
        <p className="font-display text-lg font-bold text-ink">Message sent.</p>
        <p className="mt-1.5 text-sm text-ink-soft">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mono-label mt-4 text-xs text-mint hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-left">
      {/* Honeypot field — visually hidden off-screen, but present in the
          DOM and tabbable-looking to a bot's naive form-fill scan. */}
      <div className="absolute left-[-9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          type="text"
          id="company"
          name="company"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mono-label mb-1.5 block text-xs text-ink-faint">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Your name"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="phone" className="mono-label mb-1.5 block text-xs text-ink-faint">
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            placeholder="+91 98765 43210"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="mono-label mb-1.5 block text-xs text-ink-faint">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          placeholder="you@example.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="message" className="mono-label mb-1.5 block text-xs text-ink-faint">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="What are you building, and how can I help?"
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && errorMessage && (
        <p className="text-sm text-red-400">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-mint to-violet px-6 py-3 text-sm font-semibold text-bg transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
      >
        {status === "submitting" ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send size={16} /> Send message
          </>
        )}
      </button>
    </form>
  );
}
