import apiClient from "./client";

export const getChatList = () => {
    return apiClient("/messages/");
};

export const getMessages = (userId) => {
    return apiClient(`/messages/${userId}`);
};

export const sendMessage = (recipientId, message) => {
    return apiClient(`/messages/${recipientId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
    });
};

export const markMessagesAsRead = (userId) => {
    return apiClient(`/messages/${userId}/read`, {
        method: "PATCH",
    });
};