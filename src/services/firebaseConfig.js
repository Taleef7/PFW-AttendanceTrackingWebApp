// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"; // Add this
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAYsPqO6kMM2PIo3XZ1XgIW5BA8xHl2y3Q",
  authDomain: "attendance-tracking-weba-f327c.firebaseapp.com",
  projectId: "attendance-tracking-weba-f327c",
  storageBucket: "attendance-tracking-weba-f327c.firebasestorage.app",
  messagingSenderId: "533181171145",
  appId: "1:533181171145:web:2d0f85b60255cc80a71418",
  measurementId: "G-T52GBPEPPC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app); // Initialize Auth
const db = getFirestore(app); // Initialize Firestore

export { app, analytics, auth, db }; // Export Firestore as `db`
