"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

type LoginFormProps = {
  onSubmit: (email: string, password: string) => Promise<void>;
};

export default function LoginForm({ onSubmit }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await onSubmit(email, password);
    } catch {
      setError("Wrong email or password.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-bg-card p-8"
      >
        <div className="flex items-center gap-2 text-ink-faint">
          <Lock size={16} />
          <p className="mono-label text-xs">Admin</p>
        </div>
        <h1 className="mt-3 font-display text-2xl font-bold text-ink">Sign in</h1>

        <label className="mt-6 block text-xs text-ink-faint">
          Email
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>

        <label className="mt-4 block text-xs text-ink-faint">
          Password
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 block w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink outline-none focus:border-mint"
          />
        </label>

        {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-full bg-mint px-4 py-2.5 text-sm font-semibold text-bg transition-opacity disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
