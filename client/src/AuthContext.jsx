// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

// 1. Create the Context object
const AuthContext = createContext(null);

// 2. Custom hook for consuming the context easily
export const useAuth = () => {
    return useContext(AuthContext);
};

// 3. The Provider Component
export const AuthProvider = ({ children }) => {
    // Initialize state by checking localStorage
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        // Check for the presence of the token/user data in localStorage
        return !!localStorage.getItem('token') && !!localStorage.getItem('user');
    });

    const [user, setUser] = useState(() => {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    });

    // Function to handle login (updates state and localStorage)
    const login = (token, userData) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setIsAuthenticated(true);
        setUser(userData);
    };

    // Function to handle logout (updates state and clears localStorage)
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
    };

    // Optional: Add an effect to listen for storage changes (e.g., if a user logs out in another tab)
    useEffect(() => {
        const handleStorageChange = () => {
            const token = localStorage.getItem('token');
            const userJson = localStorage.getItem('user');
            
            // Re-sync state with localStorage
            setIsAuthenticated(!!token && !!userJson);
            console.log(!!token && !!userJson);
            setUser(userJson ? JSON.parse(userJson) : null);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    // The value that will be exposed to consuming components
    const contextValue = {
        isAuthenticated,
        user,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};