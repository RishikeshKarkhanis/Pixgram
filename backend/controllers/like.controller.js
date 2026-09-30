const {
    Types: { ObjectId },
} = require("mongoose");

const likeService = require("../services/like.service.js");

const getLikes = async (req, res) => {
    try {
        const likes = await likeService.getLikes();

        return res.status(200).json(likes);
    } catch (error) {
        console.error("Error retrieving likes:", error);

        return res.status(500).json({
            error: "Failed to retrieve likes",
        });
    }
};

const createLike = async (req, res) => {
    try {
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
    } catch (error) {
        console.error("Error creating like:", error);

        return res.status(500).json({
            error: "Failed to create like",
        });
    }
};

const deleteLike = async (req, res) => {
    try {
        const { userId, postId } = req.params;

        if (!ObjectId.isValid(userId) || !ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: "Invalid user ID or post ID",
            });
        }

        const result = await likeService.deleteLike(userId, postId);

        if (!result) {
            return res.status(404).json({
                error: "Like not found",
            });
        }

        return res.status(200).json({
            message: "Like deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting like:", error);

        return res.status(500).json({
            error: "Failed to delete like",
        });
    }
};

module.exports = {
    getLikes,
    createLike,
    deleteLike,
};
