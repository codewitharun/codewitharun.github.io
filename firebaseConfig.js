// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
    apiKey: "AIzaSyAMretNVnf_DODRgjLpAPR1NmTASngLAXA",
    authDomain: "devarun-1d87a.firebaseapp.com",
    projectId: "devarun-1d87a",
    storageBucket: "devarun-1d87a.appspot.com",
    messagingSenderId: "81700495261",
    appId: "1:81700495261:web:f700b61d80b7e4eb5d9974",
    measurementId: "G-FMV5TG9E4X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)
const analytics = getAnalytics(app);
const messaging = getMessaging(app);

export { db, analytics, messaging }