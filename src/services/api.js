import { apiClient } from "../libs/api-client";
import { loginService } from "./apis/auth-service";
import {
    fetchPackages,
    fetchPackage,
    addPackage,
    updatePackage,
    deletePackage,
} from "./apis/packages-service";
import {
    fetchOrders,
    fetchOrder,
    createOrder,
    payOrder,
} from "./apis/orders-service";
import {
    fetchCustomers,
    fetchCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
} from "./apis/customers-service";
import {
    API_GEOCODING,
    GEOCODING_API_KEY,
    OPEN_CAGE_API_KEY,
} from "../libs/config";

export const fetchInfo = async (month, year) => {
    const response = await apiClient(`/info?month=${month}&year=${year}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching info failed");
    }
};

export const fetchAddressSuggestions = async (query) => {
    try {
        const response = await fetch(
            `${API_GEOCODING}?q=${query}&apiKey=${GEOCODING_API_KEY}`
        );

        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.log("Error fetching address suggestions:", error);
        throw error;
    }
};

export const fetchCoordinates = async (address) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        address
    )}&key=${OPEN_CAGE_API_KEY}`;
    try {
        const response = await axios.get(url);
        if (response.data.results.length > 0) {
            const { lat, lng } = response.data.results[0].geometry;
            return { lat, lng };
        }
        return null;
    } catch (error) {
        console.error("Error fetching coordinates from OpenCageAPI:", error);
        return null;
    }
};

export { loginService };
export {
    fetchPackages,
    fetchPackage,
    addPackage,
    updatePackage,
    deletePackage,
};
export { fetchOrders, fetchOrder, createOrder, payOrder };
export {
    fetchCustomers,
    fetchCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
};
