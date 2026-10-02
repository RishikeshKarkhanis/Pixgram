import apiClient from "./client";

export const getUsers = () =>
    apiClient("/users/");

export const getUserById = (userId) =>
    apiClient(`/users/getuserbyid/${userId}`);

export const getUserIdByUsername = (username) =>
    apiClient(`/users/getid/${encodeURIComponent(username)}`);

export const searchUsers = (query) =>
    apiClient(
        `/users/search?query=${encodeURIComponent(query)}`
    );

export const updateUser = (userId, userData) =>
    apiClient(
        `/users/update/${userId}`,
        {
            method: "PUT",
            body: JSON.stringify(userData),
        }
    );

export const deleteUser = (userId) =>
    apiClient(
        `/users/delete/${userId}`,
        {
            method: "DELETE",
        }
    );