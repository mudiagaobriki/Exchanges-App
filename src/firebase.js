// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "firebase/firestore"
import * as auth from "firebase/auth"
import firebase from "firebase/compat";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAY3CuWN5dIXqMWnwZeq93Y60xB4rQ95d0",
    authDomain: "transfy-20486.firebaseapp.com",
    projectId: "transfy-20486",
    storageBucket: "transfy-20486.appspot.com",
    messagingSenderId: "433779013368",
    appId: "1:433779013368:web:b73cb18ea01f5d53f5ad0d",
    measurementId: "G-1TSRSTFQDP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const firestore = getFirestore(app);
firebase.initializeApp(firebaseConfig)
