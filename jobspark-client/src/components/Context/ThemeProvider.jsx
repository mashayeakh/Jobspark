import React, { createContext, useEffect, useState } from 'react'

export const ThemeContext = createContext();


const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState("light");

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    const addTheme = {
        theme,
        toggleTheme,
        setTheme
    }

    return (
        <ThemeContext.Provider value={addTheme}>
            {children}
        </ThemeContext.Provider>
    );


}

export default ThemeProvider