import apiClient from "./client";

export const getPosts = () => {
    return apiClient("/posts/");
};

export const getMyPosts = (userId) => {
    return apiClient(`/posts/myposts/${userId}`);
};

export const getFeed = (userId) => {
    return apiClient(`/posts/feed/${userId}`);
};

export const createPost = (postData) => {
    return apiClient("/posts/create", {
        method: "POST",
        body: JSON.stringify(postData),
    });
};

export const updatePost = (postId, postData) => {
    return apiClient(`/posts/update/${postId}`, {
        method: "PUT",
        body: JSON.stringify(postData),
    });
};

export const deletePost = (postId) => {
    return apiClient(`/posts/delete/${postId}`, {
        method: "DELETE",
    });
};

// Get a single post
export const getPostById = (postId) => {
    return apiClient(`/posts/${postId}`);
};