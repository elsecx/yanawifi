import { apiClient } from "../../libs/api-client";

export const fetchCustomers = async (filter = "", search = "") => {
    const query = new URLSearchParams();
    if (filter) query.append("filter", filter);
    if (search) query.append("search", search);

    console.log(query.toString());

    const response = await apiClient(`/customers?${query.toString()}`, {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching packages failed");
    }
};

export const fetchCustomer = async (id) => {
    const response = await apiClient(`/customers/${id}`, {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching package failed");
    }
};

export const addCustomer = async (data) => {
    const response = await apiClient("/customers/c", {
        method: "POST",
        data,
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Adding package failed");
    }
};

export const updateCustomer = async (id, data) => {
    const response = await apiClient(`/customers/${id}/u`, {
        method: "PUT",
        data,
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Updating package failed");
    }
};

export const deleteCustomer = async (id) => {
    const response = await apiClient(`/customers/${id}/d`, {
        method: "DELETE",
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Deleting package failed");
    }
};
