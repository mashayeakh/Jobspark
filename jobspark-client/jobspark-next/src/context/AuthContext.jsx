'use client';

import { createContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from 'firebase/auth';
import { getMethod } from '@/lib/api';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };

    const fetchUserByEmail = async (email) => {
        const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1/user?email=${email}`;
        const data = await getMethod(url);
        return data;
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currUser) => {
            if (currUser) {
                const backendUser = await fetchUserByEmail(currUser.email);
                setUser({
                    firebase: currUser,
                    role: backendUser.data?.role || null,
                    ...backendUser.data,
                });
                localStorage.removeItem('adminData');
            } else {
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
            await signOut(auth);
            setUser(null);
            return true;
        } catch (error) {
            console.error('Error while signing out:', error.message);
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
