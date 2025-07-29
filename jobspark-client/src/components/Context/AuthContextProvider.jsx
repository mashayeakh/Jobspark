import React, { createContext, useEffect, useState } from 'react';
import { auth } from '../Firebase/Firebase.init';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { getMethod } from '../Utils/Api';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    // Firebase user creation
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Firebase login
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Get backend user by email
    const fetchUserByEmail = async (email) => {
        const url = `http://localhost:5000/api/v1/user?email=${email}`;
        const data = await getMethod(url);
        return data;
    };

    // Watch Firebase auth changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
            if (currUser) {
                const backendUser = await fetchUserByEmail(currUser.email);
                setUser({
                    firebase: currUser,
                    role: backendUser.data?.role || null,
                    ...backendUser.data,
                });
                localStorage.removeItem('adminData'); // Clear any stale admin data
            } else {
                // Check localStorage for admin session
                const storedAdmin = localStorage.getItem('adminData');
                if (storedAdmin) {
                    setUser(JSON.parse(storedAdmin));
                } else {
                    setUser(null);
                }
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signingOut = async () => {
        try {
            localStorage.removeItem('adminData');
            await signOut(auth); // for Firebase users
            setUser(null);
            console.log('User signed out successfully.');
            return true;
        } catch (error) {
            console.log('Error while signing out:', error.message);
            return false;
        }
    };

    const info = {
        createUser,
        loading,
        setLoading,
        user,
        setUser,
        loginUser,
        signingOut,
    };

    return <AuthContext.Provider value={info}>{children}</AuthContext.Provider>;
};

export default AuthContextProvider;
