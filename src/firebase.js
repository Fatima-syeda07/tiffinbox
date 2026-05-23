import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration (from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyDbFERgdKjVSvBM-lYoi0iWYy9lFN-frS8",
  authDomain: "tiffinbox-c18c7.firebaseapp.com",
  projectId: "tiffinbox-c18c7",
  storageBucket: "tiffinbox-c18c7.firebasestorage.app",
  messagingSenderId: "789848472001",
  appId: "1:789848472001:web:e09553ed1ebf9f40635740"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);