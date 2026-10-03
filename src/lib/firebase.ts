import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

// Analytics lives in its own module (lib/firebase-analytics.ts) with a
// minimal import graph (firebase/app + firebase/analytics only) — see the
// comment there. Re-exported here so admin code that wants both auth/db
// and analytics in one import can still get it from this file; the
// public-facing AnalyticsTracker imports the lightweight module directly
// instead, so firebase/auth + firebase/firestore never end up in ITS
// bundle (which ships on every public page via the root layout).
export { getFirebaseAnalytics } from "./firebase-analytics";

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
// The config object itself lives in ./firebaseConfig.ts.

// Guard against re-initializing on hot reload / repeated server imports.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
