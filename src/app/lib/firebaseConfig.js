import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration keys
const firebaseConfig = {
  apiKey: "AIzaSyAi7Dun-OkVdI8jTHs29FF2LHb5wc9-nNI",
  authDomain: "mykabel.firebaseapp.com",
  projectId: "mykabel",
  storageBucket: "mykabel.firebasestorage.app",
  messagingSenderId: "994729582662",
  appId: "1:994729582662:web:18fb5910976764ed30aa47",
  measurementId: "G-G758TB4P35"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export the instances to be shared across your pages
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider(); // This line fixes the current error!
export const db = getFirestore(app);
