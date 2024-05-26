import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { FIREBASE_API_KEY, FIREBASE_AUTH_DOMAIN, FIREBASE_PROJECT_ID, FIREBASE_STORAGE_BUCKET, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_WEB_APP_ID, FIREBASE_MEASUREMENT_ID } from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_WEB_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID
};

// Validate that all necessary environment variables are loaded
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.storageBucket || !firebaseConfig.messagingSenderId || !firebaseConfig.appId || !firebaseConfig.measurementId) {
  throw new Error("Missing Firebase configuration values. Please check your .env file.");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);

export { auth, firestore };

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};
