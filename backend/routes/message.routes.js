const express = require("express");

const router = express.Router();

const { sendMessage, getMessages, markMessagesAsRead, getChatList } = require("../controllers/message.controller.js");

router.get("/", getChatList);

router.get("/:userId", getMessages);

router.post("/:recipientId", sendMessage);

router.patch("/:userId/read", markMessagesAsRead);

module.exports = router;