import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMethod, postMethod } from '../Utils/Api';
import { AuthContext } from './AuthContextProvider';

export const NetworkContext = createContext();
const NetworkContextProvider = ({ children }) => {


    const { user } = useContext(AuthContext);

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

    //fetch the detials for pending req
    const [details, setDetails] = useState([]);
    const pendingDetials = async (url) => {
        const response = await getMethod(url);
        setDetails(response);
        return response;
    }


    useEffect(() => {
        if (!user?._id) return;

        fetchRec();
        sendConnection();
        pending();
        pendingDetials();
    }, [user?._id])

    const addInfo = {
        fetchRec,
        sendConnection,
        pending,
        pendingDetials,

        findRecomandatiaon,
        setFindRecomandatiaon,
        sendReq,
        setSendReq,
        pendingUser,
        setPendingUser,
        details,
        setDetails,
    }

    return (
        <NetworkContext.Provider value={addInfo}>
            {children}
        </NetworkContext.Provider>
    )
}

export default NetworkContextProvider