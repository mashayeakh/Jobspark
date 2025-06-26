import React, { useState, useRef } from 'react';
import { fetchLocations } from '../../Utils/Api';

const LocationSearch = ({ value, onChange }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [loading, setLoading] = useState(false);
    const debounceRef = useRef(null);

    const handleInputChange = (e) => {
        const inputValue = e.target.value;
        onChange(inputValue); // update parent state immediately

        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        debounceRef.current = setTimeout(async () => {
            if (inputValue.length < 2) {
                setSuggestions([]);
                return;
            }

            setLoading(true);
            const results = await fetchLocations(inputValue);
            setSuggestions(results);
            setLoading(false);
        }, 400); // debounce delay
    };

    const handleSelect = (loc) => {
        onChange(loc);
        setSuggestions([]);
    };

    return (
        <div className="relative w-fit">
            <input
                type="text"
                className="input join-item lg:input-xl text-black placeholder-black w-fit"
                placeholder="Select location"
                value={value}
                onChange={handleInputChange}
            />

            {suggestions.length > 0 || loading ? (
                <ul className="absolute top-full left-0 w-full bg-white text-black border border-gray-300 rounded-b-md shadow-lg z-50 max-h-48 overflow-auto">
                    {loading && (
                        <li className="p-2 text-sm text-gray-500 italic">Loading...</li>
                    )}
                    {suggestions.map((loc, idx) => (
                        <li
                            key={idx}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                            onClick={() => handleSelect(loc)}
                        >
                            {loc}
                        </li>
                    ))}
                </ul>
            ) : null}
        </div>
    );
};

export default LocationSearch;
