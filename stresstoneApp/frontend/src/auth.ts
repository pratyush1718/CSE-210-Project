import { auth } from "./firebase";
import { signInWithEmailAndPassword, UserCredential } from "firebase/auth";

export const signIn = async (email: string, password: string): Promise<UserCredential | null> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential;
  } catch (error) {
    console.error("Error signing in:", (error as Error).message);
    return null;
  }
};
