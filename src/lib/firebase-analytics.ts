import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported, type Analytics } from "firebase/analytics";

// Deliberately separate from lib/firebase.ts: that module also pulls in
// firebase/auth and firebase/firestore for the admin dashboard, and this
// one is imported by AnalyticsTracker — which sits in the ROOT LAYOUT and
// therefore ships on every single public page. Importing the admin-only
// SDKs from there would add ~1.2MB of Auth + Firestore JS to every page
// load just to fire a page_view event. Keeping this file's import graph
// limited to firebase/app + firebase/analytics keeps that JS out of the
// public bundle entirely — it only loads where lib/firebase.ts is
// actually imported (the /admin dashboard and the post/project data
// helpers it uses).
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

// Guard against re-initializing on hot reload / repeated imports — Firebase's
// app registry is global per config, shared with lib/firebase.ts, so
// whichever module runs first wins and the other reuses it via getApp().
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

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
