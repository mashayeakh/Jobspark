import React, { createContext, useEffect, useState } from 'react'
import { auth } from '../Firebase/Firebase.init';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { getMethod } from '../Utils/Api';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);


    //creating user with email and password
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    //login user with email and password
    const loginUser = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
    }


    //fetch user by email
    const fetchUserByEmail = async (email) => {


        const url = `http://localhost:5000/api/v1/user?email=${email}`
        const data = await getMethod(url);
        console.log("Data = ", data);
        return data;
    }

    //info about user-observer;  useEffect to observe user state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currUser) => {

            if (currUser) {
                const backendUser = await fetchUserByEmail(currUser.email);
                setUser({
                    firebase: currUser,
                    role: backendUser.data?.role || null,
                    ...backendUser.data
                });
            } else {
                setUser(null);
            }
            setLoading(false); // ✅ set to false after Firebase response
            // console.log("Current User:", currUser);
        });
        return () => unsubscribe();
    }, []);


    const signingOut = () => {
        return signOut(auth)
            .then(() => {
                // Sign-out successful.
                setUser(null);
                console.log("User signed out successfully.");
                return true;  // Return true when sign out is successful
            })
            .catch((error) => {
                // An error occurred
                console.log("Error while signing out", error.message);
                return false;  // Return false if an error occurs
            });
    }


    const info = {
        createUser,
        loading,
        setLoading,
        user,
        loginUser,
        signingOut,
    }



    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider