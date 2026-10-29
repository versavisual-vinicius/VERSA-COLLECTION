import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBBNErRhhLrhcIlEcYGZCPDclFj6YACMVc",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0047526248.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0047526248",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0047526248.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "159343690308",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:159343690308:web:2e8cdf115d444da3273211",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-1QZZ94WB5W",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

