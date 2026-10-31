import { isBoardAdmin } from "@/lib/boardServer";

// App + deploy health for /board, polled about once a minute:
// - FitPrep and EzySplit headline counts + scheduler heartbeat, from each
//   backend's /board-stats (header x-board-key = BOARD_STATS_KEY, the same
//   value set in all three Vercel projects)
// - Vercel deployments: anything building now, and production failures in
//   the last 24 h (VERCEL_TOKEN, optional VERCEL_TEAM_ID)

const APPS = [
  { id: "fitprep", name: "FitPrep", url: "https://fitprep.techtiten.com/api/board-stats", staleMin: 40 },
  { id: "ezysplit", name: "EzySplit", url: "https://ezysplit.techtiten.com/board-stats", staleMin: 15 },
] as const;

export type AppStat = {
  id: string;
  name: string;
  ok: boolean;
  error?: string;
  users?: number;
  active1?: number;
  active7?: number;
  new7?: number;
  pro?: number;
  groups?: number | null;
  schedulerLastTickAt?: string;
  schedulerAlive?: boolean;
};
export type Deploy = { project: string; state: string; target: string | null; message: string; url: string; createdAt: number };

async function appStats(key: string): Promise<AppStat[]> {
  return Promise.all(
    APPS.map(async (a) => {
      try {
        const res = await fetch(a.url, { headers: { "x-board-key": key }, cache: "no-store", signal: AbortSignal.timeout(8000) });
        if (!res.ok) return { id: a.id, name: a.name, ok: false, error: `HTTP ${res.status}` };
        const d = await res.json();
        const tick = Date.parse(d.schedulerLastTickAt || "");
        return {
          id: a.id,
          name: a.name,
          ok: true,
          users: d.users,
          active1: d.active1,
          active7: d.active7,
          new7: d.new7,
          pro: d.pro,
          groups: d.groups,
          schedulerLastTickAt: d.schedulerLastTickAt,
          schedulerAlive: Number.isFinite(tick) && Date.now() - tick < a.staleMin * 60_000,
        };
      } catch (e) {
        return { id: a.id, name: a.name, ok: false, error: (e as Error).name === "TimeoutError" ? "timeout" : "unreachable" };
      }
    }),
  );
}

async function deploys(token: string): Promise<{ building: Deploy[]; failed: Deploy[] }> {
  const team = process.env.VERCEL_TEAM_ID ? `&teamId=${process.env.VERCEL_TEAM_ID}` : "";
  const res = await fetch(`https://api.vercel.com/v6/deployments?limit=40${team}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Vercel ${res.status}`);
  const body = (await res.json()) as {
    deployments?: { name: string; state?: string; readyState?: string; target?: string | null; url: string; created: number; meta?: Record<string, string> }[];
  };
  const list: Deploy[] = (body.deployments ?? []).map((d) => ({
    project: d.name,
    state: d.readyState ?? d.state ?? "",
    target: d.target ?? null,
    message: d.meta?.githubCommitMessage?.split("\n")[0] ?? "",
    url: `https://${d.url}`,
    createdAt: d.created,
  }));
  const day = Date.now() - 86_400_000;
  return {
    building: list.filter((d) => d.state === "BUILDING" || d.state === "QUEUED" || d.state === "INITIALIZING"),
    // Only the newest deployment per project counts: a failure already fixed by a later deploy isn't an alert.
    failed: Object.values(
      list
        .filter((d) => d.target === "production")
        .reduce<Record<string, Deploy>>((acc, d) => (acc[d.project] && acc[d.project].createdAt > d.createdAt ? acc : { ...acc, [d.project]: d }), {}),
    ).filter((d) => d.state === "ERROR" && d.createdAt > day),
  };
}

export async function GET(request: Request) {
  if (!(await isBoardAdmin(request))) return Response.json({ error: "Not allowed" }, { status: 401 });
  const key = process.env.BOARD_STATS_KEY;
  const vercel = process.env.VERCEL_TOKEN;
  const [apps, dep] = await Promise.allSettled([key ? appStats(key) : Promise.resolve(null), vercel ? deploys(vercel) : Promise.resolve(null)]);
  return Response.json(
    {
      apps: apps.status === "fulfilled" ? apps.value : null,
      deploys: dep.status === "fulfilled" ? dep.value : null,
      deployError: dep.status === "rejected" ? String((dep.reason as Error).message) : undefined,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
