import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAPpp6sa7y_kc0NZIRS8qw1jOPhIO-05zk",
    authDomain: "xdash-extension.firebaseapp.com",
    projectId: "xdash-extension",
    storageBucket: "xdash-extension.appspot.com",
    messagingSenderId: "1021128391524",
    appId: "1:1021128391524:web:5a462f918f1755882f5871",
    measurementId: "G-5514Z8Y0RZ"
  };

// Initialize Firebase with the default project
const defaultProject = initializeApp(firebaseConfig);

console.log(defaultProject.name);  // "[DEFAULT]"

// Access Firestore using shorthand notation
export const db = getFirestore();
