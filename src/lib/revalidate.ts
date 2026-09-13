// Client-safe helper the admin editors call right after a successful
// create/update/delete, so the public pages (which are ISR-cached, see
// `revalidate` in their page.tsx files) refresh immediately instead of
// waiting up to 5 minutes for their normal revalidation window.
export async function revalidatePaths(paths: string[]): Promise<void> {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch {
    // Best-effort — worst case the page just waits for its normal
    // revalidate window instead of updating instantly.
  }
}
