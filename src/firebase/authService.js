import { auth, db } from "./firebase-config";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;
  await setDoc(doc(db, "User", user.uid), {
    email,
    userID: user.uid,
  });
  return user;
};

export const loginUser = async (email, password) => {
  try {
    console.log("Login attempt initiated for:", email);

    if (email === "admin") {
      // Get the specific document "ID" from Admin collection
      const adminDoc = doc(db, "Admin", "ID");
      const adminSnapshot = await getDoc(adminDoc);
      
      console.log("Checking admin document data");

      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.data();
        console.log("Admin data found:", adminData);

        // Match exact structure: Admin > ID > AdminID: 1, email: admin, password: 123
        if (adminData.email === "admin" && adminData.password === password) {
          console.log("Admin login successful");
          return { isAdmin: true };
        }
      }
      
      console.log("Admin login failed - invalid username or password");
      throw new Error("Invalid admin credentials");
    }
    
    // Regular user login remains the same
    console.log("Attempting regular user login");
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, isAdmin: false };
    
  } catch (error) {
    console.error("Login error details:", error);
    throw error;
  }
};

export const logoutUser = () => {
  return signOut(auth);
};