// Import the necessary Firebase SDK functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjs7f553IJxhuD3NIqpCRogjXO75Uu9Ts",
  authDomain: "master-class-ceb6c.firebaseapp.com",
  projectId: "master-class-ceb6c",
  storageBucket: "master-class-ceb6c.appspot.com",
  messagingSenderId: "909454960409",
  appId: "1:909454960409:web:f3025fb80bf053915a8788",
  measurementId: "G-2HDY6HSNRC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Initialize Firestore

export { db }; // ✅ Export Firestore instance
