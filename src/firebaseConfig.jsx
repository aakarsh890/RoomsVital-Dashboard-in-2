import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDSclqFgi4AW0y6aTNF7TwEyfG1vC4FHlo",
  authDomain: "dashboard-e397f.firebaseapp.com",
  projectId: "dashboard-e397f",
  storageBucket: "dashboard-e397f.firebasestorage.app",
  messagingSenderId: "1090101391902",
  appId: "1:1090101391902:web:9eea34257acec057fb340f",
  measurementId: "G-4Q5SQPBLJP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);