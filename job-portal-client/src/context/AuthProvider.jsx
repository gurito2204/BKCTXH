import React, { createContext, useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import app from "../firebase/firebase.config";

export const AuthContext = createContext();

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roleLoading, setRoleLoading] = useState(true);

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = () => {
    setLoading(true);
    setUserRole(null); // Clear role on logout
    return firebaseSignOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Ensure user exists in our database before fetching role
        try {
          await fetch("http://localhost:3000/user", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: currentUser.email, name: currentUser.displayName || currentUser.email.split("@")[0] }),
          });
        } catch (error) {
          console.error("Error ensuring user exists in DB:", error);
        }

        // Now, fetch the definitive role from the backend.
        setRoleLoading(true);
        try {
          const response = await fetch(`http://localhost:3000/user/${currentUser.email}`);
          if (response.ok) {
            const userData = await response.json();
            // ONLY update role if fetch is successful
            if (userData && userData.role) {
              setUserRole(userData.role);
            }
          } else {
            // Do not default to 'student' here. Let the existing role (or null) persist
            // until a successful fetch occurs. This prevents incorrect role assignments.
            console.warn(`Could not fetch role for ${currentUser.email}. Status: ${response.status}`);
          }
        } catch (error) {
          console.error("Failed to fetch user role:", error);
        }
        setRoleLoading(false);
      } else {
        // User is signed out
        setUserRole(null);
        setRoleLoading(false);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    userRole, // Provide role to the rest of the app
    loading,
    roleLoading, // Provide role loading status
    signInWithGoogle,
    logOut,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
