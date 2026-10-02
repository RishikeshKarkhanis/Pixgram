import apiClient from "./client";

export const loginUser = (userData) => {
    return apiClient("/users/login", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const registerUser = (userData) => {
    return apiClient("/users/register", {
        method: "POST",
        body: JSON.stringify(userData),
    });
};

export const logoutUser = () => {
    return apiClient("/users/logout", {
        method: "POST",
    });
};

export const getCurrentUser = () => {
    return apiClient("/users/currentUser");
};