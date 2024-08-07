// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// import { exportTraceState } from "next/dist/trace";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAa0ISuBU9I1wzgmk6w4MkZ61h1iGYfI4g",
  authDomain: "inventory-management-5679.firebaseapp.com",
  projectId: "inventory-management-5679",
  storageBucket: "inventory-management-5679.appspot.com",
  messagingSenderId: "560341158444",
  appId: "1:560341158444:web:b9a5b8c9194629d5599f89",
  measurementId: "G-RB7YJQLCGM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const firestore = getFirestore(app);

export {firestore};