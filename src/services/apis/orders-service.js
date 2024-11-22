import { apiClient } from "../../libs/api-client";

export const fetchOrders = async () => {
    const response = await apiClient("/orders", {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching orders failed");
    }
};

export const fetchPaymentHistory = async () => {
    const response = await apiClient("/orders/history", {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching payment history failed");
    }
};
