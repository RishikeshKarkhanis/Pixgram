import apiClient from "./client";

export const getNotifications = () =>
    apiClient("/notifications/get");

export const deleteNotification = (notificationId) =>
    apiClient(
        `/notifications/delete/${notificationId}`,
        {
            method: "DELETE",
        }
    );

export const getUnreadNotificationCount = () =>
    apiClient("/notifications/unread-count");

export const markNotificationAsRead = (notificationId) =>
    apiClient(`/notifications/read/${notificationId}`, {
        method: "PATCH",
    });