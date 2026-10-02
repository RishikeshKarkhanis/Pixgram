const { Types: { ObjectId } } = require("mongoose");

const notificationService = require("../services/notification.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all notifications
const getNotifications = asyncHandler(async (req, res) => {
    const notifications = await notificationService.getNotifications();
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

module.exports = { getNotifications, createNotification, deleteNotification };