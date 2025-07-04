import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyBjBfYRb7Nz8PVl2bSDxrFTEMoEIRWUxPA",
    authDomain: "health-band-2f5e6.firebaseapp.com",
    databaseURL: "https://health-band-2f5e6-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "health-band-2f5e6",
    storageBucket: "health-band-2f5e6.appspot.com",
    messagingSenderId: "700214707732",
    appId: "1:700214707732:web:65b36f2e067006c69c8901",
    measurementId: "G-QQJR6QPN59"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);