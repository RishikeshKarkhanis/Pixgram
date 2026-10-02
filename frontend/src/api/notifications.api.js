import apiClient from "./client";

export const getNotifications = () => {
    return apiClient("/notifications/get");
};

export const deleteNotification = (notificationId) => {
    return apiClient(`/notifications/delete/${notificationId}`, {
        method: "DELETE",
    });
};