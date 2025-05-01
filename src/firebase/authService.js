import { auth, db } from "./firebase-config"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth"
import { setDoc, doc, getDoc, serverTimestamp } from "firebase/firestore"

// Register user
export const registerUser = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password)
  const user = userCredential.user

  // Create user document with approval status set to false
  await setDoc(doc(db, "User", user.uid), {
    email,
    userID: user.uid,
    approved: false,
    role: "clerk",
    createdAt: serverTimestamp(),
  })

  return user
}

// Login user
export const loginUser = async (email, password) => {
  try {
    console.log("Login attempt initiated for:", email)

    if (email === "admin") {
      // Get the specific document "ID" from Admin collection
      const adminDoc = doc(db, "Admin", "ID")
      const adminSnapshot = await getDoc(adminDoc)

      console.log("Checking admin document data")

      if (adminSnapshot.exists()) {
        const adminData = adminSnapshot.data()
        console.log("Admin data found:", adminData)

        // Match exact structure: Admin > ID > AdminID: 1, email: admin, password: 123
        if (adminData.email === "admin" && adminData.password === password) {
          console.log("Admin login successful")
          return { isAdmin: true }
        }
      }

      console.log("Admin login failed - invalid username or password")
      throw new Error("Invalid admin credentials")
    }

    // Regular user login
    console.log("Attempting regular user login")
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Check if user is approved
    const userDoc = await getDoc(doc(db, "User", user.uid))
    if (userDoc.exists()) {
      const userData = userDoc.data()

      // If user is not approved, throw an error
      if (userData.approved === false) {
        await signOut(auth) // Sign out the user
        throw {
          code: "auth/user-not-approved",
          message: "Your account is pending approval by an administrator.",
        }
      }

      return { user: userCredential.user, isAdmin: false, userData }
    } else {
      // If user document doesn't exist, create one with default values
      await setDoc(doc(db, "User", user.uid), {
        email: user.email,
        userID: user.uid,
        approved: false,
        role: "clerk",
        createdAt: serverTimestamp(),
      })

      // Then sign out and throw error
      await signOut(auth)
      throw {
        code: "auth/user-not-approved",
        message: "Your account is pending approval by an administrator.",
      }
    }
  } catch (error) {
    console.error("Login error details:", error)
    throw error
  }
}

// Logout user
export const logoutUser = () => {
  return signOut(auth)
}

// Forgot password
export const resetPassword = async (email) => {
  await sendPasswordResetEmail(auth, email)
}

// Approve user
export const approveUser = async (userId) => {
  await setDoc(
    doc(db, "User", userId),
    {
      approved: true,
      approvedAt: serverTimestamp(),
    },
    { merge: true },
  )
}

// Reject user
export const rejectUser = async (userId) => {
  await setDoc(
    doc(db, "User", userId),
    {
      approved: false,
      rejected: true,
      rejectedAt: serverTimestamp(),
    },
    { merge: true },
  )
}
