import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// In a real app, these should be in a .env file like import.meta.env.VITE_FIREBASE_API_KEY
const firebaseConfig = {
  apiKey: "AIzaSyBl4OtQjmiWaLAly0XYr7Nzl_STxb7TpcM",
  authDomain: "fitgo-4e202.firebaseapp.com",
  projectId: "fitgo-4e202",
  storageBucket: "fitgo-4e202.firebasestorage.app",
  messagingSenderId: "609131942364",
  appId: "1:609131942364:web:a93cc5038e5188ec1cff19",
  measurementId: "G-L62514RQXQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
