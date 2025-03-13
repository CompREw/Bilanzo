import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAfptdtRoKfOVdilysy3wBJgEOxWkFLZ3M",
    authDomain: "sales-record-app-by-comprew.firebaseapp.com",
    projectId: "sales-record-app-by-comprew",
    storageBucket: "sales-record-app-by-comprew.firebasestorage.app",
    messagingSenderId: "600563232432",
    appId: "1:600563232432:web:84b4fb13323a3421839575",
    measurementId: "G-TQE9DS7NY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);