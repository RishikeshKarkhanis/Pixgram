const Notification = require("../models/notifications.model.js");

const getNotifications = async () => {
    const notifications = await Notification.find({});

    console.log("Notifications retrieved successfully:", notifications);

    return notifications;
};

const createNotification = async (notificationData) => {
    const result = await Notification.create(notificationData);

    console.log("Notification created successfully:", result);

    return result;
};

const deleteNotification = async (notificationId) => {
    const result = await Notification.deleteOne({
        _id: notificationId,
    });

    if (result.deletedCount > 0) {
        console.log("Notification deleted successfully");

        return result;
    }

    console.log("No notification found to delete");

    return null;
};

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification,
};
