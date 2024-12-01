import { apiClient } from "../libs/api-client";
import { loginService } from "./apis/auth-service";
import {
    fetchPackages,
    fetchPackage,
    addPackage,
    updatePackage,
    deletePackage,
} from "./apis/packages-service";
import { fetchOrders, fetchOrder } from "./apis/orders-service";

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

export { loginService };
export {
    fetchPackages,
    fetchPackage,
    addPackage,
    updatePackage,
    deletePackage,
};
export { fetchOrders, fetchOrder };
