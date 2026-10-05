const Message = require("../models/message.model.js");

const sendMessage = async (senderId, recipientId, content) => {
    const message = await Message.create({
        sender: senderId,
        recipient: recipientId,
        message: content,
    });

    return await Message.findById(message._id)
        .populate("sender", "username profilePicture")
        .populate("recipient", "username profilePicture");
};

const getMessages = async (userId, otherUserId) => {
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
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user",
            },
        },

        {
            $unwind: "$user",
        },

        {
            $project: {
                _id: 0,

                user: {
                    _id: "$user._id",
                    username: "$user.username",
                    profilePicture: "$user.profilePicture",
                },

                lastMessage: 1,
                lastMessageAt: 1,
                lastMessageSender: 1,
                lastMessageRecipient: 1,
                lastMessageRead: 1,
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

// =====================================================
// DELETE ALL MESSAGES INVOLVING A USER
// =====================================================

const deleteMessagesForUser = async (userId) => {
    const result = await Message.deleteMany({
        $or: [
            { sender: userId },
            { recipient: userId },
        ],
    });

    return result;
};

module.exports = {
    sendMessage,
    getMessages,
    markMessagesAsRead,
    getChatList,
    deleteMessagesForUser,
};