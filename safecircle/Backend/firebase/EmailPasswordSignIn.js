import { auth } from './firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const signUpWithEmail = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("Successful Email sign-up");
    return userCredential.user;
  } catch (error) {
    console.error("Failed Email sign-up", error);
    throw error;
  }
};

export const loginWithEmail = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("Successful Email login");
    return userCredential.user;
  } catch (error) {
    console.error("Failed Email login", error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await signOut(auth);
    console.log("Successful logout");
  } catch (error) {
    console.error("Failed logout", error);
    throw error;
  }
};
