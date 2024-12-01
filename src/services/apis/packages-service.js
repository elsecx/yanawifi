import { apiClient } from "../../libs/api-client";

export const fetchPackages = async () => {
    const response = await apiClient("/packages", {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching packages failed");
    }
};

export const fetchPackage = async (id) => {
    const response = await apiClient(`/packages/${id}`, {
        method: "GET",
    });

    if (response.status === "success") {
        return response.data;
    } else {
        throw new Error(response.message || "Fetching package failed");
    }
};

export const addPackage = async (data) => {
    const response = await apiClient("/packages/c", {
        method: "POST",
        data,
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Fetching packages failed");
    }
};

export const updatePackage = async (id, data) => {
    const response = await apiClient(`/packages/${id}/u`, {
        method: "PUT",
        data,
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Updating package failed");
    }
};

export const deletePackage = async (id) => {
    const response = await apiClient(`/packages/${id}/d`, {
        method: "DELETE",
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Deleting package failed");
    }
};
