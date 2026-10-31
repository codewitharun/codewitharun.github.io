import { firebaseConfig } from "@/lib/firebaseConfig";

// Auto wins for /board, read-only from GitHub:
// - JS Gym: every test pass recorded in codewitharun/js-gym web-status.json
//   (web passes + local Vitest passes, synced by scripts/sync.js)
// - merged PRs by codewitharun in the last 7 days
// Private data, so the caller must send the admin's Firebase ID token; it is
// checked with the Identity Toolkit lookup (no firebase-admin needed).
// Env: BOARD_GITHUB_TOKEN (fine-grained, read-only: Contents + Pull requests +
// Metadata on the repos), BOARD_EMAIL (optional, default below).

const BOARD_EMAIL = (process.env.BOARD_EMAIL || "arunk4it@gmail.com").toLowerCase();
const GH_USER = "codewitharun";

async function emailFromIdToken(idToken: string): Promise<string | null> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${firebaseConfig.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
      cache: "no-store",
    },
  );
  if (!res.ok) return null;
  const body = await res.json().catch(() => null);
  const email = body?.users?.[0]?.email;
  return typeof email === "string" ? email.toLowerCase() : null;
}

async function gh(path: string, token: string, accept = "application/vnd.github+json") {
  const res = await fetch(`https://api.github.com${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: accept,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "techtiten-board",
    },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub ${res.status} on ${path}`);
  return accept.includes("raw") ? res.text() : res.json();
}

type Status = Record<string, { visible?: string; visibleAt?: string; hidden?: string; hiddenAt?: string }>;

async function gymPasses(token: string) {
  const raw = (await gh(`/repos/${GH_USER}/js-gym/contents/web-status.json`, token, "application/vnd.github.raw+json")) as string;
  const status = JSON.parse(raw) as Status;
  const passes: { id: string; kind: "tests" | "edge cases"; at: string }[] = [];
  for (const [id, s] of Object.entries(status)) {
    if (s.visible === "passed" && s.visibleAt) passes.push({ id, kind: "tests", at: s.visibleAt });
    if (s.hidden === "passed" && s.hiddenAt) passes.push({ id, kind: "edge cases", at: s.hiddenAt });
  }
  return passes.sort((a, b) => b.at.localeCompare(a.at));
}

async function mergedPrs(token: string) {
  const since = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);
  const q = encodeURIComponent(`is:pr is:merged author:${GH_USER} merged:>=${since}`);
  const body = (await gh(`/search/issues?q=${q}&sort=updated&order=desc&per_page=20`, token)) as {
    items?: { title: string; html_url: string; repository_url: string; closed_at: string }[];
  };
  return (body.items ?? []).map((i) => ({
    title: i.title,
    url: i.html_url,
    repo: i.repository_url.split("/").pop() ?? "",
    at: i.closed_at,
  }));
}

export async function GET(request: Request) {
  const idToken = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ?? "";
  const email = idToken ? await emailFromIdToken(idToken) : null;
  if (email !== BOARD_EMAIL) return Response.json({ error: "Not allowed" }, { status: 401 });

  const token = process.env.BOARD_GITHUB_TOKEN;
  if (!token) return Response.json({ configured: false, gym: [], prs: [] });

  const [gym, prs] = await Promise.allSettled([gymPasses(token), mergedPrs(token)]);
  return Response.json(
    {
      configured: true,
      gym: gym.status === "fulfilled" ? gym.value : [],
      prs: prs.status === "fulfilled" ? prs.value : [],
      errors: [gym, prs].filter((r) => r.status === "rejected").map((r) => String((r as PromiseRejectedResult).reason?.message ?? r)),
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
