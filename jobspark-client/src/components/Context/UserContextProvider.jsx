import React, { createContext, useState } from 'react'
import { getMethod } from '../Utils/Api';

export const UserContext = createContext();

const UserContextProvider = ({ children }) => {


    const [profile, setProfile] = useState([]);

    const getProfileById = async (url) => {
        const response = await getMethod(url);
        setProfile(response);
        console.log("Response from user context ", response);

        return response;
    }


    const addInfo = {
        getProfileById,

        profile,
        setProfile,
    }


    return (
        <UserContext.Provider value={addInfo}>
            {children}
        </UserContext.Provider>
    )
}

export default UserContextProvider