import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAU65JuwBfm5dpyA9GWKHBLfxUKIoQlUtk",
    authDomain: "judge-2c877.firebaseapp.com",
    projectId: "judge-2c877",
    storageBucket: "judge-2c877.firebasestorage.app",
    messagingSenderId: "492888132570",
    appId: "1:492888132570:web:c7b9217c7f2fa15c1bcee3",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);