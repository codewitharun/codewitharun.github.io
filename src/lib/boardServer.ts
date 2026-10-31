// Server-only helpers for the /board API routes (auth + GitHub).
import { firebaseConfig } from "@/lib/firebaseConfig";

const BOARD_EMAIL = (process.env.BOARD_EMAIL || "admin@techtiten.com").toLowerCase();

/** True when the request carries the admin's Firebase ID token (checked via Identity Toolkit). */
export async function isBoardAdmin(request: Request): Promise<boolean> {
  const idToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  if (!idToken) return false;
  const res = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
    cache: "no-store",
  });
  if (!res.ok) return false;
  const email = (await res.json().catch(() => null))?.users?.[0]?.email;
  return typeof email === "string" && email.toLowerCase() === BOARD_EMAIL;
}

export async function gh(path: string, token: string, accept = "application/vnd.github+json") {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "techtiten-board",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const e = new Error(`GitHub ${res.status} on ${path.split("?")[0]}`) as Error & { status?: number };
    e.status = res.status;
    throw e;
  }
  return accept.includes("raw") ? res.text() : res.json();
}
