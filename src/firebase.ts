import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC4EBS7ViksVjkswAmaIkADLudBQBRzuPs",
  authDomain: "wai-yan-news.firebaseapp.com",
  projectId: "wai-yan-news",
  storageBucket: "wai-yan-news.firebasestorage.app",
  messagingSenderId: "413693428537",
  appId: "1:413693428537:web:5033646a7f36db49d21ee8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); // Export Firestore so the app can check the database
export const googleProvider = new GoogleAuthProvider();