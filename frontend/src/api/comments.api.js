import apiClient from "./client";

export const getComments = () => {
    return apiClient("/comments/");
};

export const getPostComments = (postId) => {
    return apiClient(`/comments/${postId}`);
};

export const createComment = (commentData) => {
    return apiClient("/comments/create", {
        method: "POST",
        body: JSON.stringify(commentData),
    });
};

export const deleteComment = (commentId) => {
    return apiClient(`/comments/delete/${commentId}`, {
        method: "DELETE",
    });
};