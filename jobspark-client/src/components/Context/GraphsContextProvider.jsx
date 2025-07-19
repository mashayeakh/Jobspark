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

    //Arae Data 
    const [areaData, setAreaData] = useState([]);
    const fetchingAreaData = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/daily-activity`
        const res = await getMethod(url);
        if (res.success === true) {
            setAreaData(res);
        }
    }


    //applications by hour
    //http://localhost:5000/api/v1/recruiter/6839c86523d93cb0daa3de99/apps-perHour
    const [byHours, setByHours] = useState([]);
    const fetchingByHours = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/apps-perHour`
        const res = await getMethod(url);
        if (res.success === true) {
            setByHours(res);
        }
    }
    //applications by hour
    //http://localhost:5000/api/v1/recruiter/6839c86523d93cb0daa3de99/apps-perHour
    const [categoryWise, setCategoryWise] = useState([]);
    const fetchingCategoryWise = async () => {
        const url = `http://localhost:5000/api/v1/recruiter/${user?._id}/categorywise-App`
        const res = await getMethod(url);
        if (res.success === true) {
            setCategoryWise(res);
        }
    }

    useEffect(() => {
        if (!user?._id) return;

        fetchLineData();
        fetchingBarData();
        fetchingAreaData();
        fetchingByHours();
        fetchingCategoryWise();
    }, [user?._id])

    const addInfo = {
        fetchLineData,
        fetchingBarData,
        fetchingAreaData,
        fetchingByHours,
        fetchingCategoryWise,


        lineData,
        setLineData,
        barData,
        setBarData,
        areaData,
        setAreaData,
        byHours,
        setByHours,
        categoryWise,
        setCategoryWise,
    }


    return (
        <GraphsContext.Provider value={addInfo}>
            {children}
        </GraphsContext.Provider>
    )
}

export default GraphsContextProvider