import React, { createContext, useEffect, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';

export const NetworkContext = createContext();
const NetworkContextProvider = ({ children }) => {


    const [findRecomandatiaon, setFindRecomandatiaon] = useState([]);

    //fetch the ai recomamdandated users
    const fetchRec = async (url) => {
        const resposne = await getMethod(url);
        setFindRecomandatiaon(resposne);
        console.log("Response fropm Network ", resposne);
        return resposne
    }

    //send the connection req
    const [sendReq, setSendReq] = useState([]);
    const sendConnection = async (url, data) => {
        const response = await postMethod(url, data);
        setSendReq(response);
        return response;
    }


    //fetch the ids of pending req
    const [pendingUser, setPendingUser] = useState([]);
    const pending = async (url) => {
        const response = await getMethod(url);
        setPendingUser(response);
        return response;
    }




    useEffect(() => {
        fetchRec();
        sendConnection();
        pending();
    }, [])

    const addInfo = {
        fetchRec,
        sendConnection,
        pending,

        findRecomandatiaon,
        setFindRecomandatiaon,
        sendReq,
        setSendReq,
        pendingUser,
        setPendingUser,
    }

    return (
        <NetworkContext.Provider value={addInfo}>
            {children}
        </NetworkContext.Provider>
    )
}

export default NetworkContextProvider