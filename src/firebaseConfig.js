import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"; // Import getStorage from Firebase Storage

const firebaseConfig = {
  apiKey: "AIzaSyCfoLQCFyXi3IThsA0nBLIKi7W-oZLjP2Q",
  authDomain: "artgallery-972bd.firebaseapp.com",
  projectId: "artgallery-972bd",
  storageBucket: "artgallery-972bd.appspot.com",
  messagingSenderId: "978623567938",
  appId: "1:978623567938:web:878f4d9cc96909e2f475db",
  measurementId: "G-X26X2GSLLD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app); // Initialize Firebase Storage

export { auth, firestore, storage }; // Export Firebase Storage along with other services
