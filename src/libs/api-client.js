import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "./config";

const getHeaders = (optionsHeaders = {}) => {
    return {
        "Content-Type": "application/json",
        ...optionsHeaders,
    };
};

export const apiClient = async (endpoint, options = {}) => {
    const token = await AsyncStorage.getItem("jwtToken");

    const url = `${API_URL}${
        endpoint.startsWith("/") ? endpoint : `/${endpoint}`
    }`;
    console.log(`Making request to ${url}`);

    const headers = getHeaders(options.headers);
    if (token) {
        headers["Authorization"] = token;
    }

    try {
        const response = await axios(url, {
            ...options,
            headers,
            timeout: 10000,
        });
        return response?.data;
    } catch (error) {
        if (error.response) {
            console.error(`Error: ${error} - ${error}`);
            throw new Error(error.response.data.message || "Server Error");
        } else if (error.request) {
            console.error("No response received from server", error.request);
            throw new Error("No response from server");
        } else {
            console.error("Error setting up request", error.message);
            throw new Error("Request setup error");
        }
    }
};
