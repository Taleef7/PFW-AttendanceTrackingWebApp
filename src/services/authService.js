import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, fetchSignInMethodsForEmail } from "firebase/auth";

export const signup = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await sendEmailVerification(user);
    console.log("Verification email sent!");
  } catch (error) {
    throw new Error(error.message);
  }
};

export const login = async (email, password) => {
  const auth = getAuth();
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    if (!user.emailVerified) {
      throw new Error("Please verify your email before logging in.");
    }

    return user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const logout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
    });
};

export const checkEmailVerifiedByEmail = async (email) => {
  const auth = getAuth();
  try {
      const user = auth.currentUser;
      return user ? user.emailVerified : false;
  } catch (error) {
    console.error("Error checking email verification:", error.message);
    return false;
  }
};
export const resendVerificationEmail = async (user) => {
  const auth = getAuth();
  try {
    await sendEmailVerification(user);
    console.log("Verification email re-sent!");
  } catch (error) {
    throw new Error("Error re-sending verification email:", error.message);
  }
};
