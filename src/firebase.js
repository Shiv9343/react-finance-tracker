import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAy0X0YAd3U1Pv8lOz-tkBJ8iJ7c7TYzKQ",
  authDomain: "expense-manager-4671b.firebaseapp.com",
  projectId: "expense-manager-4671b",
  storageBucket: "expense-manager-4671b.firebasestorage.app",
  messagingSenderId: "730092548973",
  appId: "1:730092548973:web:3c47c0c637a3380758e064",
  measurementId: "G-C2YS55N4DN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and export it so other files can use it
export const db = getFirestore(app);