
import React, { createContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut as firebaseSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import app from '../firebase/firebase.config';

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
                // User is signed in, now fetch their role from our backend.
                setRoleLoading(true);
                try {
                    const response = await fetch(`http://localhost:3000/user/${currentUser.email}`);
                    if (response.ok) {
                        const userData = await response.json();
                        setUserRole(userData.role); // Set the user's role
                    } else {
                         // Handle cases where the user exists in Firebase but not in our DB yet
                        setUserRole('student'); // Assign default role
                    }
                } catch (error) {
                    console.error("Failed to fetch user role:", error);
                    setUserRole('student'); // Fallback to default role on error
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
        logOut
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
