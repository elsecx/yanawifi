import { apiClient } from "../libs/api-client";
import { loginService } from "./apis/auth-service";
import {
    fetchPackages,
    updatePackage,
    deletePackage,
} from "./apis/packages-service";
import { fetchOrders, fetchPaymentHistory } from "./apis/orders-service";

export const fetchInfo = async () => {
    const response = await apiClient("/info", {
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
export { fetchPackages, updatePackage, deletePackage };
export { fetchOrders, fetchPaymentHistory };
