import { FirebaseError } from "firebase/app";
import { auth } from "./firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, UserCredential, getIdToken  } from "firebase/auth";

export const signIn = async (email: string, password: string): Promise<UserCredential | string> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User signed in:", userCredential.user);
    return userCredential;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Error signing in:", error.message);
      return error.code;
    }
    console.error("Unknown error signing in:", error);
    return "unknown_error";
  }
};

export const signUp = async (email: string, password: string): Promise<UserCredential | string> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    console.log("User reigstered in firebase:", user);
    const port = import.meta.env.VITE_BACKEND_PORT || 3000;

    const response = await fetch(`http://localhost:${port}/api/user/register`, {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        },
        body: JSON.stringify({
        firebaseId: user.uid,
        email: user.email
        }),
    });

    if (response.ok) {
      const data = await response.json(); 
      const user = data.user; 
      console.log("User registered in MongoDB:", user);
    }else{
      const errorData = await response.json();
      console.error("Backend error registering user:", errorData);
      return "backend_error";
    }

    return userCredential;
  } catch (error: unknown) {
    if (error instanceof FirebaseError) {
      console.error("Error signing up:", error.message);
      return error.code;
    }
    console.error("Unknown error signing up:", error);
    return "unknown_error";
  }
};

