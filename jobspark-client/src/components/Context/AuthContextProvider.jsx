import React, { createContext, useState } from 'react'
import { auth } from '../Firebase/Firebase.init';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {

    const [user, setUser] = useState([]);
    const [loading, setLoading] = useState(false);


    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }


    const info = {
        createUser,
        loading,
        setLoading,
    }



    return (
        <AuthContext.Provider value={info}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContextProvider