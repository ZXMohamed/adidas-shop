import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAYygJ3yS3uN1nSD5AsBPQP-bfLDQDX-iE",
    authDomain: "fireauth-d3aef.firebaseapp.com",
    databaseURL: "https://adidas-shop-95690-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fireauth-d3aef",
    storageBucket: "fireauth-d3aef.appspot.com",
    messagingSenderId: "392866553267",
    appId: "1:392866553267:web:5950e44a848db0ef377fc6"
};


const app = initializeApp(firebaseConfig, "storage");

export const storage = getStorage(app);

