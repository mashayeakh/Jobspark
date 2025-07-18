import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContextProvider';
import { getMethod } from '../Utils/Api';

export const GraphsContext = createContext();

const GraphsContextProvider = ({ children }) => {


    const { user } = useContext(AuthContext);

    //Line Data
    const [lineData, setLineData] = useState([]);
    const fetchLineData = async () => {
        const url = `http://localhost:5000/api/v1/graphs/recruiter/${user?._id}/application/over-time`;
        const res = await getMethod(url);
        if (res.success === true) {
            setLineData(res);
        }
    }

    //Bar Data
    const [barData, setBarData] = useState([]);
    const fetchingBarData = async () => {
        const url = `http://localhost:5000/api/v1/graphs/recruiter/${user?._id}/job-wise-applications`;
        const res = await getMethod(url);
        if (res.success === true) {
            setBarData(res);
        }
    }

    useEffect(() => {
        if (!user?._id) return;

        fetchLineData();
        fetchingBarData();
    }, [user?._id])

    const addInfo = {
        fetchLineData,
        fetchingBarData,


        lineData,
        setLineData,
        barData,
        setBarData,
    }


    return (
        <GraphsContext.Provider value={addInfo}>
            {children}
        </GraphsContext.Provider>
    )
}

export default GraphsContextProvider