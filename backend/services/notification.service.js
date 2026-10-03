const Notification = require("../models/notifications.model.js");

const getNotifications = async (userId) => {
    const notifications = await Notification.find({
        recipient: userId,
    })
        .populate("sender", "username profilePicture")
        .populate("post", "imageUrl caption")
        .populate("comment", "content")
        .sort({ createdAt: -1 });

    console.log(
        `Notifications for user ${userId} retrieved successfully:`,
        notifications,
    );

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

const getUnreadNotificationCount = async (userId) => {
    const count = await Notification.countDocuments({
        recipient: userId,
        read: false,
    });

    return count;
};

const markNotificationAsRead = async (notificationId, userId) => {
    const notification = await Notification.findOneAndUpdate(
        {
            _id: notificationId,
            recipient: userId,
        },
        {
            $set: { read: true },
        },
        {
            new: true,
        }
    );

    return notification;
};

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification,
    getUnreadNotificationCount,
    markNotificationAsRead,
};