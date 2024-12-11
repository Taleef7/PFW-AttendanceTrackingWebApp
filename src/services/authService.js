import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, signOut, sendPasswordResetEmail, confirmPasswordReset } from "firebase/auth";

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

    localStorage.setItem('uid', auth.currentUser?.uid)
    return user;
  } catch (error) {
    console.log(error);
    if (error.code === "auth/invalid-credential") {
      throw new Error("Invalid Credentails");
    } else if (error.code === "auth/user-not-found") {
      throw new Error("No user found with this email.");
    } else {
      throw new Error(error.message);
    }
  }
};

export const logout = () => {
  const auth = getAuth();
  signOut(auth)
    .then(() => {
      localStorage.clear();
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Error logging out:", error.message);
    });
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

export const sendPasswordReset = async (email) => {
  const auth = getAuth();
  try {
    await sendPasswordResetEmail(auth, email);
    console.log("Password reset email sent!");
    return "Password reset email sent. Please check your inbox.";
  } catch (error) {
    console.error("Error sending password reset email: ", error.message);
    return error.message;
  }
};

export const resetPassword = async (oobCode, newPassword) => {
  const auth = getAuth();
  try {
    await confirmPasswordReset(auth, oobCode, newPassword);
    console.log("Password has been reset successfully!");
    return "Password reset successful. You can now log in with your new password.";
  } catch (error) {
    console.error("Error resetting password: ", error.message);
    return error.message;
  }
};