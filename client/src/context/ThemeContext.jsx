import React, { createContext, useState, useEffect, useContext } from 'react';

export const ThemeContext = createContext();

export const useTheme = () => {
    return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    useEffect(() => {
        console.log("Theme changed to:", theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log("Added dark class");
        } else {
            document.documentElement.classList.remove('dark');
            console.log("Removed dark class");
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
