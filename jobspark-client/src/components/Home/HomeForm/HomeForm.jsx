import React, { useState } from 'react';
import { IoSearchOutline } from "react-icons/io5";
import KeywordSearch from './KeywordSearch';
import LocationSearch from './LocationSearch';
import jobCategories from './../../../constants/JobCategories';
import { useNavigate } from 'react-router';

const HomeForm = () => {
    const [keyword, setKeyword] = useState("");
    const [location, setLocation] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");

    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault(); // prevent form from refreshing

        const queryParams = new URLSearchParams({
            keyword,
            location,
            category: selectedCategory
        }).toString();

        navigate(`/search?${queryParams}`);
    };

    return (
        <div>
            <form onSubmit={handleSearch}>
                <fieldset className="fieldset w-fit p-2">
                    <div className="join">
                        <KeywordSearch value={keyword} onChange={setKeyword} />
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

                        <button type="submit" className="btn join-item lg:btn-xl">
                            <IoSearchOutline />
                        </button>
                    </div>
                </fieldset>
            </form>
        </div>
    );
};

export default HomeForm;
