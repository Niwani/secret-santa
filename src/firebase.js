import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase } from "firebase/database";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCCD8NGbAG2ZvXh8TvLy22eKoJ6DqfjTKQ",
  authDomain: "secret-santa-630e7.firebaseapp.com",
  projectId: "secret-santa-630e7",
  storageBucket: "secret-santa-630e7.firebasestorage.app",
  messagingSenderId: "268469925550",
  appId: "1:268469925550:web:4935f8f3480ef6bf8fdf3f",
  measurementId: "G-R1CMCZG1ZD",
  databaseURL: "https://secret-santa-630e7-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Export the REALTIME DATABASE
export const database = getDatabase(app);
