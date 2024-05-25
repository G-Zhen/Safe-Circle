import { auth } from './firebaseConfig';
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

const provider = new GoogleAuthProvider();

const signInWithGoogle = async (onSuccess) => {
  try {
    await signInWithRedirect(auth, provider);
    const result = await getRedirectResult(auth);

    if (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      console.log("User signed in with Google:", user);

      if (result.additionalUserInfo.isNewUser) {
        console.log("New user detected");
        onSuccess('Onboarding');
      } else {
        console.log("Existing user detected");
        onSuccess('Home');
      }
    }
  } catch (error) {
    console.error("Error during Google sign-in:", error);
  }
};

export default signInWithGoogle;




