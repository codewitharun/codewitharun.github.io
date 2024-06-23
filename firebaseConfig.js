// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const analytics = getAnalytics(app);