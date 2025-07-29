// src/hooks/useJobSeekerProfiles.js
import { useContext, useEffect, useState } from "react";
import { JobSeekerDashboardContext } from "../Context/AdminContext/JobSeekerDashboardContextProvider";

const useJobSeekerProfiles = () => {
    const { stats, active_profile, completeness } = useContext(JobSeekerDashboardContext);
    const [profiles, setProfiles] = useState([]);

    const [completePro, setCompletePro] = useState([]);
    const [prof, setProf] = useState([])



    useEffect(() => {
        if (stats?.data?.allJobSeekers) {
            setProfiles(stats.data.allJobSeekers);
        }
        if (stats?.data?.recentSignIns) {
            setProf(stats.data.recentSignIns);
        }
        if (completeness?.completedUsers) {
            setCompletePro(completeness.completedUsers);
        }
    }, [completeness, stats]);



    console.log("PROfiles ", profiles);


    return { profiles, active_profile, completeness, completePro, prof };
};

export default useJobSeekerProfiles;
