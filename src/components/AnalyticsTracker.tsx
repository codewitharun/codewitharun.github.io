"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { logEvent } from "firebase/analytics";
import { getFirebaseAnalytics } from "@/lib/firebase";

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

    getFirebaseAnalytics().then((analytics) => {
      if (!analytics) return; // unsupported browser, ad blocker, or SSR — no-op
      logEvent(analytics, "page_view", {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
      });
    });
  }, [pathname, searchParams]);

  return null;
}
