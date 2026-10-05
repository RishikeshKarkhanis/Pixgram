const Message = require("../models/message.model.js");
const Follow = require("../models/follow.model.js");

const canMessage = async (userId, otherUserId) => {
    const follow = await Follow.findOne({
        $or: [
            {
                follower: userId,
                following: otherUserId,
            },
            {
                follower: otherUserId,
                following: userId,
            },
        ],
    });

    return !!follow;
};

const sendMessage = async (senderId, recipientId, content) => {
    const allowed = await canMessage(senderId, recipientId);

    if (!allowed) {
        const error = new Error(
            "You can only message users you follow or users who follow you"
        );

        error.statusCode = 403;
        throw error;
    }

    const message = await Message.create({
        sender: senderId,
        recipient: recipientId,
        message: content,
    });

    return message;
};

const getMessages = async (userId, otherUserId) => {
    const allowed = await canMessage(userId, otherUserId);

    if (!allowed) {
        const error = new Error(
            "You are not allowed to access this conversation"
        );

        error.statusCode = 403;
        throw error;
    }

    const messages = await Message.find({
        $or: [
            {
                sender: userId,
                recipient: otherUserId,
            },
            {
                sender: otherUserId,
                recipient: userId,
            },
        ],
    })
        .populate("sender", "username profilePicture")
        .populate("recipient", "username profilePicture")
        .sort({ createdAt: 1 });

    return messages;
};

const markMessagesAsRead = async (userId, otherUserId) => {
    const allowed = await canMessage(userId, otherUserId);

    if (!allowed) {
        const error = new Error(
            "You are not allowed to access this conversation"
        );

        error.statusCode = 403;
        throw error;
    }

    const result = await Message.updateMany(
        {
            sender: otherUserId,
            recipient: userId,
            read: false,
        },
        {
            $set: {
                read: true,
            },
        }
    );

    return result;
};

const getChatList = async (userId) => {
    const chats = await Message.aggregate([
        {
            $match: {
                $or: [
                    { sender: userId },
                    { recipient: userId },
                ],
            },
        },

        {
            $sort: {
                createdAt: -1,
            },
        },

        {
            $project: {
                otherUser: {
                    $cond: [
                        { $eq: ["$sender", userId] },
                        "$recipient",
                        "$sender",
                    ],
                },

                message: 1,
                createdAt: 1,
                sender: 1,
                recipient: 1,
                read: 1,
            },
        },

        {
            $group: {
                _id: "$otherUser",
                lastMessage: {
                    $first: "$message",
                },
                lastMessageAt: {
                    $first: "$createdAt",
                },
                lastMessageSender: {
                    $first: "$sender",
                },
                lastMessageRecipient: {
                    $first: "$recipient",
                },
                lastMessageRead: {
                    $first: "$read",
                },
            },
        },

        {
            $sort: {
                lastMessageAt: -1,
            },
        },
    ]);

    return chats;
};

module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
    getChatList
};