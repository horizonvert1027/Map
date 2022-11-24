// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvuJXYm2z2LB_7_KdLc2GzN6vkRbPR8JM",
  authDomain: "plancam-fda56.firebaseapp.com",
  databaseURL: "https://plancam-fda56-default-rtdb.firebaseio.com",
  projectId: "plancam-fda56",
  storageBucket: "plancam-fda56.appspot.com",
  messagingSenderId: "107125968278",
  appId: "1:107125968278:web:77af8b97241db5357321b7",
  measurementId: "G-DTNM3YF8WK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);