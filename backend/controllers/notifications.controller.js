const { Types: { ObjectId } } = require("mongoose");

const notificationService = require("../services/notification.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all notifications
const getNotifications = asyncHandler(async (req, res) => {
    const userId = req.user._doc._id;

    const notifications =
        await notificationService.getNotifications(userId);

    return res.status(200).json(notifications);
});

// Create notification
const createNotification = asyncHandler(async (req, res) => {
    const notification = await notificationService.createNotification(req.body);
    return res.status(201).json(notification);
});

// Delete notification
const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Invalid notification ID",
        });
    }

    const result = await notificationService.deleteNotification(id);

    if (!result) {
        return res.status(404).json({
            error: "Notification not found",
        });
    }

    return res.status(200).json({
        message: "Notification deleted successfully",
    });
});

const getUnreadNotificationCount = asyncHandler(async (req, res) => {
    const userId = req.user._doc._id;

    const count =
        await notificationService.getUnreadNotificationCount(userId);

    return res.status(200).json({
        count,
    });
});

const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Invalid notification ID",
        });
    }

    const userId = req.user._doc._id;

    const notification =
        await notificationService.markNotificationAsRead(
            id,
            userId
        );

    if (!notification) {
        return res.status(404).json({
            error: "Notification not found",
        });
    }

    return res.status(200).json(notification);
});

module.exports = { getNotifications, createNotification, 
                    deleteNotification, getUnreadNotificationCount, 
                    markNotificationAsRead 
                };