import { apiClient } from "../../libs/api-client";

export const loginService = async (username, password) => {
    const response = await apiClient("/signin", {
        method: "POST",
        data: { username, password },
    });

    if (response.status === "success") {
        return response;
    } else {
        throw new Error(response.message || "Login failed");
    }
};
