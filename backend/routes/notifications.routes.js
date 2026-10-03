const notificationsController = require('../controllers/notifications.controller');

const router = require('express').Router();

router.get('/get', notificationsController.getNotifications);

router.delete('/delete/:id', notificationsController.deleteNotification);

router.get(
    '/unread-count',
    notificationsController.getUnreadNotificationCount
);

router.patch(
    '/read/:id',
    notificationsController.markNotificationAsRead
);

module.exports = router;