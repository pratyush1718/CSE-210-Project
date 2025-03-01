import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential } from "firebase/auth";

export const signIn = async (email: string, password: string): Promise<UserCredential | String> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential;
  } catch (error : any) {
    console.error("Error signing in:", (error as Error).message);
    return error.code;
  }
};

export const signUp = async (email: string, password: string): Promise<UserCredential | String> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User signed up:", userCredential.user);
    return userCredential;
  } catch (error: any) {
    console.error("Error signing up:", (error as Error).message);
    return error.code;
  }
};