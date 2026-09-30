const { Types: { ObjectId } } = require('mongoose');

const notificationService = require('../services/notification.service.js');

const getNotifications = async (req, res) => {
    try {
        const notifications =
            await notificationService.getNotifications();

        return res.status(200).json(notifications);
    } catch (error) {
        console.error(
            'Error retrieving notifications:',
            error
        );

        return res.status(500).json({
            error: 'Failed to retrieve notifications'
        });
    }
};

const createNotification = async (req, res) => {
    try {
        const notification =
            await notificationService.createNotification(
                req.body
            );

        return res.status(201).json(notification);
    } catch (error) {
        console.error(
            'Error creating notification:',
            error
        );

        return res.status(500).json({
            error: 'Failed to create notification'
        });
    }
};

const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid notification ID'
            });
        }

        const result =
            await notificationService.deleteNotification(id);

        if (!result) {
            return res.status(404).json({
                error: 'Notification not found'
            });
        }

        return res.status(200).json({
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        console.error(
            'Error deleting notification:',
            error
        );

        return res.status(500).json({
            error: 'Failed to delete notification'
        });
    }
};

module.exports = {
    getNotifications,
    createNotification,
    deleteNotification
};