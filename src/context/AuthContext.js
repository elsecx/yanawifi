import React, { createContext, useEffect, useState } from "react";
import { useAsyncStorage } from "../hooks/useAsyncStorage";
import { loginService } from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const { storeData, getData, removeData } = useAsyncStorage();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    const checkToken = async () => {
        const token = await getData("jwtToken");
        setIsAuthenticated(!!token);
    };

    const login = async (username, password) => {
        const response = await loginService(username, password);
        if (response && response.token) {
            await storeData("jwtToken", response.token);
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = async () => {
        await removeData("jwtToken");
        setIsAuthenticated(false);
    };

    useEffect(() => {
        checkToken();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
