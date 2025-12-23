// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAKGO_Uxqwi29CJ1jomWLaYPldXzBAeQo4",
  authDomain: "bkctxhs.firebaseapp.com",
  projectId: "bkctxhs",
  storageBucket: "bkctxhs.firebasestorage.app",
  messagingSenderId: "604061543686",
  appId: "1:604061543686:web:ba1060ff0ecfa998c18287",
  measurementId: "G-90PWRPNZB7",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app;
