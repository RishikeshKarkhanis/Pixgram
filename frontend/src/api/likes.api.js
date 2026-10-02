import apiClient from "./client";

export const getLikes = () => {
    return apiClient("/likes/");
};

export const toggleLike = (userId, postId) => {
    return apiClient("/likes/toggle", {
        method: "POST",
        body: JSON.stringify({
            userId,
            postId,
        }),
    });
};

export const createLike = (userId, postId) => {
    return apiClient("/likes/create", {
        method: "POST",
        body: JSON.stringify({
            userId,
            postId,
        }),
    });
};

export const deleteLike = (userId, postId) => {
    return apiClient("/likes/delete", {
        method: "DELETE",
        body: JSON.stringify({
            userId,
            postId,
        }),
    });
};