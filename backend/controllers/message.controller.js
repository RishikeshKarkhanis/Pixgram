const asyncHandler = require("../utils/asyncHandler.js");
const messageService = require("../services/message.service.js");

const sendMessage = asyncHandler(async (req, res) => {
    const senderId = req.user._id;
    const { recipientId } = req.params;
    const { message } = req.body;

    if (!message || !message.trim()) {
        return res.status(400).json({
            error: "Message cannot be empty",
        });
    }

    const result = await messageService.sendMessage(
        senderId,
        recipientId,
        message
    );

    return res.status(201).json(result);
});

const getMessages = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { userId: otherUserId } = req.params;

    const messages = await messageService.getMessages(
        userId,
        otherUserId
    );

    return res.status(200).json(messages);
});

const markMessagesAsRead = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { userId: otherUserId } = req.params;

    const result = await messageService.markMessagesAsRead(
        userId,
        otherUserId
    );

    return res.status(200).json({
        message: "Messages marked as read",
        modifiedCount: result.modifiedCount,
    });
});

const getChatList = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const chats = await messageService.getChatList(userId);

    return res.status(200).json(chats);
});

module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
    getChatList,
};