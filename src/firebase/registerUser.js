export const registerUser = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "User", user.uid), {
        email,
        userID: user.uid,
      });
      return user;
    } catch (error) {
      // Firebase error for email already in use
      if (error.code === 'auth/email-already-in-use') {
        throw new Error('Email is already registered. Please use a different email.');
      }
      throw error;
    }
  };