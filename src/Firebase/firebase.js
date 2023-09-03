// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import.meta.env

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
//   authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
//   projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
//   storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
//   appId: import.meta.env.VITE_FIREBASE_APP_ID
// };
const firebaseConfig = {
  apiKey: "AIzaSyAh1zEvU1yVsNoR4yxd1CLaE1n-pRkv5N8",
  authDomain: "billbuddy-1a23f.firebaseapp.com",
  projectId: "billbuddy-1a23f",
  storageBucket: "billbuddy-1a23f.appspot.com",
  messagingSenderId: "659029292057",
  appId: "1:659029292057:web:b59e96ff8d7cebc5716688"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getFirestore(app)
const storage= getStorage();

export {app, auth,database, storage}