import React, { createContext, useContext, useEffect, useState } from 'react'
import { getMethod, patchMethod, postMethod } from '../Utils/Api';
import { AuthContext } from './AuthContextProvider';

export const NetworkContext = createContext();
const NetworkContextProvider = ({ children }) => {


    const { user } = useContext(AuthContext);

    const [findRecomandatiaon, setFindRecomandatiaon] = useState([]);

    //fetch the ai recomamdandated users
    const fetchRec = async (url) => {
        const resposne = await getMethod(url);
        setFindRecomandatiaon(resposne);
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

        // Update both pending request details and count
        if (response.success) {
            setDetails(response); // existing list of full users
            setPendingUser({ count: response.count }); // ✅ update count for sidebar
        }

        return response;
    };


    //convert pending req into accpeted/rejected
    const [status, setStatus] = useState([]);
    const statusChange = async (url, data) => {
        const res = await patchMethod(url, data);
        console.log("RES to ", res);
        setStatus(res);
        return res;
    }


    //get accepted users info
    const [accepted, setAccepted] = useState([]);
    const fetchAcceptedInfo = async (url) => {
        const res = await getMethod(url);
        setAccepted(res);
        return (res);
    }


    //get 


    useEffect(() => {
        if (!user?._id) return;

        fetchRec();
        sendConnection();
        pending();
        pendingDetials();
        statusChange();
        fetchAcceptedInfo();
    }, [user?._id])

    const addInfo = {
        fetchRec,
        sendConnection,
        pending,
        pendingDetials,
        statusChange,
        fetchAcceptedInfo,

        findRecomandatiaon,
        setFindRecomandatiaon,
        sendReq,
        setSendReq,
        pendingUser,
        setPendingUser,
        details,
        setDetails,
        status,
        setStatus,
        accepted,
        setAccepted,
    }

    return (
        <NetworkContext.Provider value={addInfo}>
            {children}
        </NetworkContext.Provider>
    )
}

export default NetworkContextProvider