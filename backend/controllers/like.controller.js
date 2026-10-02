const { Types: { ObjectId } } = require("mongoose");

const likeService = require("../services/like.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all likes
const getLikes = asyncHandler(async (req, res) => {
    const likes = await likeService.getLikes();
    return res.status(200).json(likes);
});

// Create like
const createLike = asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(postId)) {
        return res.status(400).json({
            error: "Invalid user ID or post ID",
        });
    }

    const like = await likeService.createLike({
        userId,
        postId,
    });

    return res.status(201).json(like);
});

// Delete like
const deleteLike = asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(postId)) {
        return res.status(400).json({
            error: "Invalid user ID or post ID"
        });
    }

    const result = await likeService.deleteLike(userId, postId);

    if (!result) {
        return res.status(404).json({
            error: "Like not found"
        });
    }

    return res.status(200).json({
        message: "Like deleted successfully"
    });
});

const toggleLike = asyncHandler(async (req, res) => {
    const { userId, postId } = req.body;

    if (!ObjectId.isValid(userId) || !ObjectId.isValid(postId)) {
        return res.status(400).json({
            error: "Invalid user ID or post ID"
        });
    }

    const existingLike = await likeService.findLike(userId, postId);

    if (existingLike) {
        await likeService.deleteLike(userId, postId);

        return res.status(200).json({
            liked: false
        });
    }

    await likeService.createLike({ userId, postId });

    return res.status(200).json({
        liked: true
    });
});

module.exports = { getLikes, createLike, deleteLike, toggleLike };
