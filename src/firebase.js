// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"; // ✅ Realtime Database
import { getStorage } from "firebase/storage";   // ✅ Storage for CVs

const firebaseConfig = {
  apiKey: "AIzaSyDMUwIoYB-G65Jox16ynvtqR_3-hE8Rzig",
  authDomain: "hnd-iot.firebaseapp.com",
  projectId: "hnd-iot",
  storageBucket: "hnd-iot.appspot.com",
  messagingSenderId: "4841713277",
  appId: "1:4841713277:web:6260ceaa540a3857c74b14"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export necessary services
export const auth = getAuth(app);
export const db = getDatabase(app);     // ✅ Use this in your component
export const storage = getStorage(app); // ✅ For uploading CVs
