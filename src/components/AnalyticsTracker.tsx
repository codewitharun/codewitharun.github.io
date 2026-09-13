"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Both the Firebase Analytics SDK and the lightweight app-init module
// (see lib/firebase-analytics.ts) are loaded via a dynamic import() inside
// the effect below, not a static import here — this component sits in the
// root layout and therefore ships on every public page, so keeping it out
// of the initial bundle means visitors don't pay for analytics JS before
// first paint. It still loads within a second of mount either way.

/**
 * Fires a Firebase Analytics `page_view` event on first load and on every
 * client-side route change (Next.js App Router doesn't reload the page, so
 * there's no natural page load event to hook otherwise). This one event is
 * what feeds every Analytics report AND the Firebase console's "Realtime"
 * tab — Realtime isn't a separate thing to build, it's a live view over
 * these same events, so as soon as this fires, visits show up there within
 * a few seconds.
 */
export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const path = query ? `${pathname}?${query}` : pathname;

    Promise.all([
      import("@/lib/firebase-analytics"),
      import("firebase/analytics"),
    ]).then(([{ getFirebaseAnalytics }, { logEvent }]) => {
      getFirebaseAnalytics().then((analytics) => {
        if (!analytics) return; // unsupported browser, ad blocker, or SSR — no-op
        logEvent(analytics, "page_view", {
          page_path: path,
          page_location: window.location.href,
          page_title: document.title,
        });
      });
    });
  }, [pathname, searchParams]);

  return null;
}
