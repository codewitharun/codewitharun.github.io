import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Reusing the existing "devarun-1d87a" Firebase project (previously wired
// up in the old appaura-admin dashboard) rather than standing up a new
// one, per Arun's call. These values are the public web-app config
// Firebase issues for every client — not secrets. Firebase's own docs are
// explicit about this: real access control lives in Firestore Security
// Rules (see firestore.rules at the repo root), never in hiding this
// object. See README.md's "Admin & blog setup" section for the one-time
// Firebase Console steps this depends on.
//
// Firebase Storage is intentionally not initialized here — that account
// got blocked, so image uploads now go through ImageKit instead (see
// src/lib/imageUpload.ts and src/app/api/upload-image/route.ts).
// storage.rules is no longer deployed/needed.
const firebaseConfig = {
  apiKey: "AIzaSyAMretNVnf_DODRgjLpAPR1NmTASngLAXA",
  authDomain: "devarun-1d87a.firebaseapp.com",
  databaseURL: "https://devarun-1d87a-default-rtdb.firebaseio.com",
  projectId: "devarun-1d87a",
  storageBucket: "devarun-1d87a.appspot.com",
  messagingSenderId: "81700495261",
  appId: "1:81700495261:web:f700b61d80b7e4eb5d9974",
  measurementId: "G-FMV5TG9E4X",
};

// Guard against re-initializing on hot reload / repeated server imports.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

// Analytics only runs in the browser (it needs `window`, IndexedDB, etc.),
// so it can't just be `getAnalytics(app)` at module scope — that would
// throw during server rendering and at build time. `isSupported()` also
// weeds out environments where it silently wouldn't work anyway (very old
// browsers, some in-app webviews, private-browsing IndexedDB restrictions).
// See src/components/AnalyticsTracker.tsx for where this actually gets used
// to log page_view events — that's what populates both the historical
// Analytics reports and the "Realtime" tab in the Firebase console, since
// Realtime isn't a separate product to wire up, just a live view over the
// same events.
let analyticsPromise: Promise<Analytics | null> | null = null;

export function getFirebaseAnalytics(): Promise<Analytics | null> {
  if (typeof window === "undefined") return Promise.resolve(null);
  if (!analyticsPromise) {
    analyticsPromise = isSupported()
      .then((supported) => (supported ? getAnalytics(app) : null))
      .catch(() => null);
  }
  return analyticsPromise;
}

export default app;
