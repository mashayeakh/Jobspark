import React, { useState } from 'react'
import Autosuggest from 'react-autosuggest'
import keywordSuggestions from '../../../constants/Keywords';

const KeywordSearch = ({ value, onChange }) => {


    const [suggestions, setSuggestions] = useState([]);

    const getSuggestions = (input) => {
        const inputValue = input.trim().toLowerCase();
        return inputValue.length === 0
            ? []
            : keywordSuggestions.filter((keyword) =>
                keyword.toLowerCase().includes(inputValue)
            );
    };

    return (
        <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={({ value }) =>
                setSuggestions(getSuggestions(value))
            }
            onSuggestionsClearRequested={() => setSuggestions([])}
            getSuggestionValue={(s) => s}
            renderSuggestion={(s) => <div>{s}</div>}
            inputProps={{
                placeholder: "Search for keywords",
                value,
                onChange: (_, { newValue }) => onChange(newValue),
                className:
                    "input join-item lg:input-xl text-black w-full placeholder-black",
            }}
            theme={{
                container: "relative w-full",
                suggestionsContainer:
                    "absolute mt-1 w-full bg-white  border-gray-300 rounded-b-md shadow-lg z-50",
                suggestion:
                    "px-4 py-2 text-sm text-gray-800 cursor-pointer hover:bg-gray-100",
                suggestionHighlighted: "bg-gray-100",
            }}
        />

    )
}

export default KeywordSearch