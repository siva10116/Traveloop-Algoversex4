import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCLMFTij-imKjo7vehkn9GIHsJdgtsBhlY",
  authDomain: "traveloop-algoversex4.firebaseapp.com",
  projectId: "traveloop-algoversex4",
  storageBucket: "traveloop-algoversex4.firebasestorage.app",
  messagingSenderId: "457583163857",
  appId: "1:457583163857:web:00ef51697526ad20ed08f0",
  measurementId: "G-CD2MJREBJR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
