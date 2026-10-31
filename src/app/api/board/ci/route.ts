import { gh, isBoardAdmin } from "@/lib/boardServer";

// Live GitHub Actions for /board: what's building right now + the last results.
// Looks at repos pushed in the last 14 days (max 10) so it stays a handful of
// API calls. Needs "Actions: Read" on BOARD_GITHUB_TOKEN.

const ACTIVE = new Set(["queued", "in_progress", "waiting", "pending", "requested"]);

type Run = {
  repo: string;
  workflow: string;
  title: string;
  branch: string;
  status: string;
  conclusion: string | null;
  url: string;
  startedAt: string;
  updatedAt: string;
};

type ApiRun = {
  name?: string;
  display_title?: string;
  head_branch?: string;
  status: string;
  conclusion: string | null;
  html_url: string;
  run_started_at?: string;
  created_at: string;
  updated_at: string;
};

export async function GET(request: Request) {
  if (!(await isBoardAdmin(request))) return Response.json({ error: "Not allowed" }, { status: 401 });
  const token = process.env.BOARD_GITHUB_TOKEN;
  if (!token) return Response.json({ configured: false, active: [], recent: [] });

  try {
    const repos = (await gh(`/user/repos?per_page=100&sort=pushed&affiliation=owner`, token)) as { full_name: string; name: string; pushed_at: string }[];
    const fresh = repos.filter((r) => Date.now() - Date.parse(r.pushed_at) < 14 * 86_400_000).slice(0, 10);
    const perRepo = await Promise.allSettled(
      fresh.map(async (r) => {
        const body = (await gh(`/repos/${r.full_name}/actions/runs?per_page=5`, token)) as { workflow_runs?: ApiRun[] };
        return (body.workflow_runs ?? []).map<Run>((w) => ({
          repo: r.name,
          workflow: w.name ?? "Workflow",
          title: w.display_title ?? "",
          branch: w.head_branch ?? "",
          status: w.status,
          conclusion: w.conclusion,
          url: w.html_url,
          startedAt: w.run_started_at ?? w.created_at,
          updatedAt: w.updated_at,
        }));
      }),
    );
    const runs = perRepo.flatMap((p) => (p.status === "fulfilled" ? p.value : []));
    const denied = perRepo.some((p) => p.status === "rejected" && (p.reason as { status?: number })?.status === 403);
    const active = runs.filter((r) => ACTIVE.has(r.status)).sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    const recent = runs
      .filter((r) => r.status === "completed" && Date.now() - Date.parse(r.updatedAt) < 3 * 86_400_000)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
      .slice(0, 6);
    return Response.json(
      { configured: true, active, recent, hint: denied && !runs.length ? 'Add "Actions: Read" to BOARD_GITHUB_TOKEN' : undefined },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return Response.json({ configured: true, active: [], recent: [], hint: (e as Error).message });
  }
}
