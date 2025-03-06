import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyC9f4OQuNH4pDerdufunmgM34CfOf9zeX0",
    authDomain: "adidas-shop-95690.firebaseapp.com",
    databaseURL: "https://adidas-shop-95690-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "adidas-shop-95690",
    storageBucket: "adidas-shop-95690.firebasestorage.app",
    messagingSenderId: "797844093381",
    appId: "1:797844093381:web:dab9a148fbe1a2d76473ac",
    measurementId: "G-T7FN0PKSB4"
};


export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
