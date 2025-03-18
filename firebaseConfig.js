// Import the necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2uUkqajCYaLFCVxODr-HiD3zntny7wXE",
  authDomain: "master-class-senegal.firebaseapp.com",
  projectId: "master-class-senegal",
  storageBucket: "master-class-senegal.firebasestorage.app",
  messagingSenderId: "90336133949",
  appId: "1:90336133949:web:259faa5badcd7819e87b54"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore

export { db }; // ✅ Export Firestore instance
