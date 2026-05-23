import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Register with email, password, role, fullName
  const register = async (email, password, fullName, role) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update display name
      await updateProfile(user, { displayName: fullName });
      
      // Determine approval status: cooks need admin approval, customers auto-approved
      const approved = role === "customer" ? true : false;
      
      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email,
        fullName,
        role,
        approved,
        createdAt: new Date().toISOString(),
      });
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login and fetch role & approval status
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Fetch role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserRole(userData.role);
        setIsApproved(userData.approved);
        return { success: true, role: userData.role, approved: userData.approved };
      } else {
        // Fallback if no Firestore doc (should not happen)
        return { success: false, error: "User data not found" };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserRole(null);
    setIsApproved(false);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data();
          setUserRole(data.role);
          setIsApproved(data.approved);
        }
      } else {
        setUserRole(null);
        setIsApproved(false);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    isApproved,
    login,
    register,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};