import { gh, isBoardAdmin } from "@/lib/boardServer";

// Auto wins for /board, read-only from GitHub:
// - JS Gym: every test pass recorded in codewitharun/js-gym web-status.json
//   (web passes + local Vitest passes, synced by scripts/sync.js)
// - merged PRs by codewitharun in the last 7 days
// Only for the admin login (see lib/boardServer.ts).
// Env: BOARD_GITHUB_TOKEN (fine-grained, read-only: Contents, Pull requests,
// Actions, Metadata on the repos), BOARD_EMAIL (optional).

const GH_USER = "codewitharun";

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
  if (!(await isBoardAdmin(request))) return Response.json({ error: "Not allowed" }, { status: 401 });

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
