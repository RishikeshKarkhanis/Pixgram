const noitificationsController = require('../controllers/notifications.controller');
const router = require('express').Router();

router.get('/get', noitificationsController.getNotifications);
router.delete('/delete/:id', noitificationsController.deleteNotification);

module.exports = router;