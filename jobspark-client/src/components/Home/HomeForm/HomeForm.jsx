import React, { useState } from 'react'
import { IoLocation, IoSearchOutline } from "react-icons/io5";
import KeywordSearch from './KeywordSearch';
import LocationSearch from './LocationSearch';
import jobCategories from './../../../constants/JobCategories';
import { getMethod } from '../../Utils/Api';


const HomeForm = () => {


    const [keyword, setKeyword] = useState(""); // should be a string
    const [location, setLocation] = useState("");

    const [selectedCategory, setSelectedCategory] = useState([]);

    const [searchResults, setSearchResults] = useState([]);

    // const category = jobCategories

    const handleSearch = async () => {
        const url = `http://localhost:5000/api/v1/jobs/search?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}&category=${encodeURIComponent(selectedCategory)}`;
        const response = await getMethod(url);
        setSearchResults(response.data);
    };



    return (
        <>
            <div>
                <form action="">
                    <fieldset className="fieldset w-fit p-2">
                        <div className="join">
                            <KeywordSearch value={keyword} onChange={setKeyword} />

                            {/* <select defaultValue="Select location" className="select input join-item w-fit lg:input-xl text-black placeholder-black" placeholder="Location">
                                <option disabled={true}>Select location</option>
                                <option>Crimson</option>
                                <option>Amber</option>
                                <option>Velvet</option>
                            </select> */}

                            <LocationSearch value={location} onChange={setLocation} />


                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="select input join-item w-fit lg:input-xl text-black placeholder-black"
                            >
                                <option disabled value="">Select Category</option>
                                {jobCategories.map((c, i) => (
                                    <option key={i} value={c.label}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>

                            <button onClick={handleSearch} className="btn join-item lg:btn-xl">
                                <IoSearchOutline />
                            </button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </>
    )
}

export default HomeForm