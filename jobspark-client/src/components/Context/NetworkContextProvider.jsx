import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
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


    //get all connections of a specific user
    const [conn, setConn] = useState([]);
    const fetchConn = async () => {
        const url = `http://localhost:5000/api/v1/network/getAllConn/${user?._id}`
        const res = await getMethod(url);
        if (res.success === true) {
            setConn(res);
            return res;
        }
    }

    console.log("CONN- ", conn.count);

    useEffect(() => {
        if (!user?._id) return;

        fetchRec();
        sendConnection();
        pending();
        pendingDetials();
        statusChange();
        fetchAcceptedInfo();
        fetchConn();
    }, [user?._id])

    const addInfo = useMemo(() => ({
        fetchRec,
        sendConnection,
        pending,
        pendingDetials,
        statusChange,
        fetchAcceptedInfo,
        fetchConn,

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
        conn,
        setConn,
    }), [accepted, conn, details, fetchConn, findRecomandatiaon, pendingUser, sendReq, status]);

    return (
        <NetworkContext.Provider value={addInfo}>
            {children}
        </NetworkContext.Provider>
    )
}

export default NetworkContextProvider