const notificationsController = require('../controllers/notifications.controller');

const router = require('express').Router();

router.get('/get', notificationsController.getNotifications);

router.delete('/delete/:id', notificationsController.deleteNotification);

module.exports = router;