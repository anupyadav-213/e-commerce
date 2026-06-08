import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

const getInitialUser = () => {
    try {
        const userInfo = localStorage.getItem("userInfo");
        return userInfo ? JSON.parse(userInfo) : null;
    } catch (error) {
        console.error('Failed to parse stored user:', error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const initial = getInitialUser();
        return initial ? { ...initial, role: initial.role?.toLowerCase?.() } : null;
    });

    const login = (userData) => {
        const normalizedUser = { ...userData, role: userData.role?.toLowerCase?.() };
        setUser(normalizedUser);
        localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("userInfo");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

