import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthContext } from './AuthContextProvider';
import { getMethod } from '../Utils/Api';

export const GraphsContext = createContext();

const GraphsContextProvider = ({ children }) => {

    const { user } = useContext(AuthContext);
    const [lineData, setLineData] = useState([]);
    const fetchLineData = async () => {
        const url = `http://localhost:5000/api/v1/graphs/recruiter/${user?._id}/application/over-time`;
        const res = await getMethod(url);
        if (res.success === true) {
            setLineData(res);
        }
    }

    useEffect(() => {
        if (!user?._id) return;

        fetchLineData();
    }, [user?._id])

    const addInfo = {
        fetchLineData,


        lineData,
        setLineData
    }


    return (
        <GraphsContext.Provider value={addInfo}>
            {children}
        </GraphsContext.Provider>
    )
}

export default GraphsContextProvider