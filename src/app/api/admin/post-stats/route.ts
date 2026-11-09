import { isBoardAdmin } from "@/lib/boardServer";
import { googlePost, googleToken, serviceAccount } from "@/lib/googleApi";

// Real numbers per blog post for /admin (admin only):
//  - GA4 (Firebase Analytics, already on every page): views, readers,
//    engaged time, store_click events and scroll (= read to ~90%) per post
//  - Search Console: impressions, clicks, average position, top search
// Env (Vercel): GOOGLE_SERVICE_ACCOUNT (JSON, one line), GA4_PROPERTY_ID
// (numeric), optional GSC_SITE (default "sc-domain:techtiten.com").
// The service account needs Viewer on the GA4 property and to be added as
// a user in Search Console. Setup steps: README "Post stats".

export type PostStat = {
  views: number;
  readers: number;
  avgEngagedSec: number;
  storeClicks: number;
  readToEnd: number;
  searchImpressions: number;
  searchClicks: number;
  searchPosition: number | null;
  topQuery: string | null;
};
export type PostStatsResponse = {
  days: number;
  sources: { analytics: string; search: string };
  posts: Record<string, PostStat>;
};

const empty = (): PostStat => ({
  views: 0,
  readers: 0,
  avgEngagedSec: 0,
  storeClicks: 0,
  readToEnd: 0,
  searchImpressions: 0,
  searchClicks: 0,
  searchPosition: null,
  topQuery: null,
});

/** "/blog/my-post/" or "https://techtiten.com/blog/my-post?x" -> "my-post" */
function slugOf(pathOrUrl: string): string | null {
  let path = pathOrUrl;
  try {
    if (/^https?:/i.test(path)) path = new URL(path).pathname;
  } catch {
    return null;
  }
  const m = path.split("?")[0].match(/^\/blog\/([^/]+)\/?$/);
  return m ? decodeURIComponent(m[1]) : null;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

type Ga4Row = { dimensionValues: { value: string }[]; metricValues: { value: string }[] };

async function analytics(days: number, posts: Record<string, PostStat>): Promise<string> {
  const property = process.env.GA4_PROPERTY_ID;
  if (!property) return "not set up (GA4_PROPERTY_ID missing)";
  const token = await googleToken(["https://www.googleapis.com/auth/analytics.readonly"]);
  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${property}:runReport`;
  const dateRanges = [{ startDate: `${days}daysAgo`, endDate: "today" }];
  const blogOnly = { filter: { fieldName: "pagePath", stringFilter: { matchType: "BEGINS_WITH", value: "/blog/" } } };

  const [pages, events] = await Promise.all([
    googlePost<{ rows?: Ga4Row[] }>(url, token, {
      dateRanges,
      dimensions: [{ name: "pagePath" }],
      metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }, { name: "userEngagementDuration" }],
      dimensionFilter: blogOnly,
      limit: 1000,
    }),
    googlePost<{ rows?: Ga4Row[] }>(url, token, {
      dateRanges,
      dimensions: [{ name: "pagePath" }, { name: "eventName" }],
      metrics: [{ name: "eventCount" }],
      dimensionFilter: {
        andGroup: {
          expressions: [blogOnly, { filter: { fieldName: "eventName", inListFilter: { values: ["store_click", "scroll"] } } }],
        },
      },
      limit: 1000,
    }),
  ]);

  const engaged: Record<string, number> = {};
  for (const r of pages.rows ?? []) {
    const slug = slugOf(r.dimensionValues[0].value);
    if (!slug) continue;
    const s = (posts[slug] ??= empty());
    s.views += Number(r.metricValues[0].value);
    s.readers += Number(r.metricValues[1].value);
    engaged[slug] = (engaged[slug] ?? 0) + Number(r.metricValues[2].value);
  }
  for (const [slug, sec] of Object.entries(engaged)) {
    const s = posts[slug];
    s.avgEngagedSec = s.readers ? Math.round(sec / s.readers) : 0;
  }
  for (const r of events.rows ?? []) {
    const slug = slugOf(r.dimensionValues[0].value);
    if (!slug) continue;
    const s = (posts[slug] ??= empty());
    const n = Number(r.metricValues[0].value);
    if (r.dimensionValues[1].value === "store_click") s.storeClicks += n;
    else s.readToEnd += n;
  }
  return "ok";
}

type GscRow = { keys: string[]; clicks: number; impressions: number; position: number };

async function search(days: number, posts: Record<string, PostStat>): Promise<string> {
  const site = process.env.GSC_SITE || "sc-domain:techtiten.com";
  const token = await googleToken(["https://www.googleapis.com/auth/webmasters.readonly"]);
  const url = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const end = new Date();
  const start = new Date(Date.now() - days * 86_400_000);
  const base = {
    startDate: isoDay(start),
    endDate: isoDay(end),
    dimensionFilterGroups: [{ filters: [{ dimension: "page", operator: "contains", expression: "/blog/" }] }],
  };

  const [byPage, byQuery] = await Promise.all([
    googlePost<{ rows?: GscRow[] }>(url, token, { ...base, dimensions: ["page"], rowLimit: 1000 }),
    googlePost<{ rows?: GscRow[] }>(url, token, { ...base, dimensions: ["page", "query"], rowLimit: 5000 }),
  ]);

  const weighted: Record<string, number> = {};
  for (const r of byPage.rows ?? []) {
    const slug = slugOf(r.keys[0]);
    if (!slug) continue;
    const s = (posts[slug] ??= empty());
    s.searchImpressions += r.impressions;
    s.searchClicks += r.clicks;
    weighted[slug] = (weighted[slug] ?? 0) + r.position * r.impressions;
  }
  for (const [slug, w] of Object.entries(weighted)) {
    const s = posts[slug];
    s.searchPosition = s.searchImpressions ? Math.round((w / s.searchImpressions) * 10) / 10 : null;
  }
  const best: Record<string, number> = {};
  for (const r of byQuery.rows ?? []) {
    const slug = slugOf(r.keys[0]);
    if (!slug || !posts[slug]) continue;
    if (r.impressions > (best[slug] ?? 0)) {
      best[slug] = r.impressions;
      posts[slug].topQuery = r.keys[1];
    }
  }
  return "ok";
}

const fail = (e: unknown) => `error: ${e instanceof Error ? e.message : String(e)}`;

export async function GET(request: Request) {
  if (!(await isBoardAdmin(request))) return Response.json({ error: "Not allowed" }, { status: 401 });

  const days = Math.min(480, Math.max(1, Number(new URL(request.url).searchParams.get("days")) || 30));
  const posts: Record<string, PostStat> = {};

  if (!serviceAccount()) {
    const missing = "not set up (GOOGLE_SERVICE_ACCOUNT missing)";
    return Response.json({ days, sources: { analytics: missing, search: missing }, posts } satisfies PostStatsResponse);
  }

  const [a, s] = await Promise.allSettled([analytics(days, posts), search(days, posts)]);
  const body: PostStatsResponse = {
    days,
    sources: {
      analytics: a.status === "fulfilled" ? a.value : fail(a.reason),
      search: s.status === "fulfilled" ? s.value : fail(s.reason),
    },
    posts,
  };
  return Response.json(body, { headers: { "Cache-Control": "private, no-store" } });
}
