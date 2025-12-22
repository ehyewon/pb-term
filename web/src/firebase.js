// web/src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD94xSJv6zLsUl4sAbUN-8_mAaelFQg0N0",
    authDomain: "pb-term.firebaseapp.com",
    projectId: "pb-term",
    storageBucket: "pb-term.firebasestorage.app",
    messagingSenderId: "1026820405914",
    appId: "1:1026820405914:web:beb7f2505d60e1d3a13d23",
    measurementId: "G-9E630WXLH5"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
