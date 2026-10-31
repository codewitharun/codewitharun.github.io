// Local-time day helpers for the board (keys are yyyy-mm-dd in the viewer's timezone).
export const pad = (n: number) => String(n).padStart(2, "0");
export const dayKey = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
export const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const daysBetween = (a: Date, b: Date) =>
  Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / 86_400_000);

/** Consecutive days (ending today, or yesterday if today isn't done yet) where has(day) is true. */
export function streak(has: (key: string) => boolean, today = new Date()): number {
  let d = has(dayKey(today)) ? today : addDays(today, -1);
  let n = 0;
  while (has(dayKey(d))) {
    n++;
    d = addDays(d, -1);
  }
  return n;
}

export const ago = (d: Date | null, now = new Date()) => {
  if (!d) return "never";
  const days = daysBetween(d, now);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return `${days} days ago`;
};
