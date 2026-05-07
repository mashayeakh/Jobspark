import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyApVd3FY8jd-tCJ6qAwAHHR4D05bMe7reA",
    authDomain: "jobspark-b7208.firebaseapp.com",
    projectId: "jobspark-b7208",
    storageBucket: "jobspark-b7208.firebasestorage.app",
    messagingSenderId: "723950544904",
    appId: "1:723950544904:web:d694b3fd70a48cd9a249bd"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
