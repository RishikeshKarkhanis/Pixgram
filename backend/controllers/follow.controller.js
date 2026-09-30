const {
    Types: { ObjectId },
} = require("mongoose");

const followService = require("../services/follow.service.js");

const getFollows = async (req, res) => {
    try {
        const follows = await followService.getFollows();

        return res.status(200).json(follows);
    } catch (error) {
        console.error("Error retrieving follows:", error);

        return res.status(500).json({
            error: "Failed to retrieve follows",
        });
    }
};

const isFollowing = async (req, res) => {
    try {
        const { followingId, followerId } = req.params;

        if (!ObjectId.isValid(followingId) || !ObjectId.isValid(followerId)) {
            return res.status(400).json({
                error: "Invalid user ID",
            });
        }

        const follow = await followService.isFollowing(followingId, followerId);

        return res.status(200).json({
            isFollowing: !!follow,
            follow,
        });
    } catch (error) {
        console.error("Error checking follow status:", error);

        return res.status(500).json({
            error: "Failed to check follow status",
        });
    }
};

const createFollow = async (req, res) => {
    try {
        const { followingId, followerId } = req.params;

        if (!ObjectId.isValid(followingId) || !ObjectId.isValid(followerId)) {
            return res.status(400).json({
                error: "Invalid user ID",
            });
        }

        const result = await followService.createFollow(
            followingId,
            followerId,
        );

        return res.status(201).json(result);
    } catch (error) {
        console.error("Error creating follow:", error);

        return res.status(500).json({
            error: "Failed to follow user",
        });
    }
};

const deleteFollow = async (req, res) => {
    try {
        const { followingId, followerId } = req.params;

        if (!ObjectId.isValid(followingId) || !ObjectId.isValid(followerId)) {
            return res.status(400).json({
                error: "Invalid user ID",
            });
        }

        const result = await followService.deleteFollow(
            followingId,
            followerId,
        );

        if (result.deletedCount === 0) {
            return res.status(404).json({
                error: "Follow relationship not found",
            });
        }

        return res.status(200).json({
            message: "User unfollowed successfully",
        });
    } catch (error) {
        console.error("Error deleting follow:", error);

        return res.status(500).json({
            error: "Failed to unfollow user",
        });
    }
};

module.exports = {
    getFollows,
    isFollowing,
    createFollow,
    deleteFollow,
};
