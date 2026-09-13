import { revalidatePath } from "next/cache";

/**
 * Posts and projects are written straight from the browser via the
 * Firestore client SDK (see posts.ts / projects.ts) — Next.js has no idea a
 * write happened, so the ISR cache for /blog, /blog/[slug], /portfolio etc.
 * only refreshes on its own schedule (`revalidate = 300` on those pages),
 * up to 5 minutes after a save. The admin editors call this route right
 * after a successful save/delete so the public pages update immediately
 * instead of showing stale content for however long is left on that timer.
 *
 * Not auth-gated: it only forces an on-demand refetch of already-public
 * data, the same thing that would happen anyway once the revalidate window
 * elapses — there's nothing here for a request to gain by calling it.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const paths = body?.paths;

  if (!Array.isArray(paths) || paths.some((p) => typeof p !== "string")) {
    return Response.json({ error: "paths must be an array of strings" }, { status: 400 });
  }

  for (const path of paths) {
    revalidatePath(path);
  }

  return Response.json({ revalidated: true, paths });
}
