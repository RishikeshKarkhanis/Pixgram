const {
    Types: { ObjectId },
} = require("mongoose");
const followService = require("../services/follow.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all follows
const getFollows = asyncHandler(async (req, res) => {
    const follows = await followService.getFollows();

    return res.status(200).json(follows);
});

// Check if user is following another user
const isFollowing = asyncHandler(async (req, res) => {
    const { following, follower } = req.body;

    if (!ObjectId.isValid(following) || !ObjectId.isValid(follower)) {
        return res.status(400).json({
            error: "Invalid user ID",
        });
    }

    const follow = await followService.isFollowing(following, follower);

    return res.status(200).json({
        isFollowing: !!follow,
        follow,
    });
});

// Create follow
const createFollow = asyncHandler(async (req, res) => {
    const { following, follower } = req.body;

    if (!ObjectId.isValid(following) || !ObjectId.isValid(follower)) {
        return res.status(400).json({
            error: "Invalid user ID",
        });
    }

    const result = await followService.createFollow(following, follower);

    return res.status(201).json(result);
});

// Delete follow
const deleteFollow = asyncHandler(async (req, res) => {
    const { following, follower } = req.body;

    if (!ObjectId.isValid(following) || !ObjectId.isValid(follower)) {
        return res.status(400).json({
            error: "Invalid user ID",
        });
    }

    const result = await followService.deleteFollow(following, follower);

    if (result.deletedCount === 0) {
        return res.status(404).json({
            error: "Follow relationship not found",
        });
    }

    return res.status(200).json({
        message: "User unfollowed successfully",
    });
});

module.exports = {
    getFollows,
    isFollowing,
    createFollow,
    deleteFollow,
};
