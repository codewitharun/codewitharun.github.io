import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Reusing the existing "devarun-1d87a" Firebase project (previously wired
// up in the old appaura-admin dashboard) rather than standing up a new
// one, per Arun's call. These values are the public web-app config
// Firebase issues for every client — not secrets. Firebase's own docs are
// explicit about this: real access control lives in Firestore/Storage
// Security Rules (see firestore.rules / storage.rules at the repo root),
// never in hiding this object. See README.md's "Admin & blog setup"
// section for the one-time Firebase Console steps this depends on.
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
export const storage = getStorage(app);
export default app;
