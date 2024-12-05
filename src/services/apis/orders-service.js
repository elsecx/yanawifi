import { apiClient } from "../../libs/api-client";

export const fetchOrders = async (filter = "", search = "") => {
    const query = new URLSearchParams();
    if (filter) query.append("filter", filter);
    if (search) query.append("search", search);

    const response = await apiClient(`/orders?${query.toString()}`, {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching orders failed");
    }
};

export const fetchOrder = async (id) => {
    const response = await apiClient(`/orders/${id}`, {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching order failed");
    }
};

export const createOrder = async (data) => {
    const response = await apiClient("/orders/c", {
        method: "POST",
        data,
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Creating order failed");
    }
};

export const payOrder = async (id) => {
    const response = await apiClient(`/orders/${id}/pay`, {
        method: "PUT",
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Pay order failed");
    }
};
