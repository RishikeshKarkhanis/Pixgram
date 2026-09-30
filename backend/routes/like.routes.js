const express = require("express");

const { getLikes, createLike, deleteLike } = require("../controllers/like.controller.js");

const Like = require("../models/like.model.js");
const router = express.Router();

// Get all likes
router.get("/", getLikes);

// Toggle like
router.post("/toggle", async (req, res) => {
    const { userId, postId } = req.body;

    const existingLike = await Like.findOne({
        userId,
        postId,
    });

    if (existingLike) {
        const result = await deleteLike(userId, postId);

        if (result) {
            return res.json({
                liked: false,
            });
        }

        return res.status(404).json({
            message: "No like found to delete",
        });
    }

    const likeData = {
        userId,
        postId,
    };

    await createLike(likeData);

    res.json({
        liked: true,
    });
});

// Create like
router.post("/create", createLike);

// Delete like
router.delete("/delete", async (req, res) => {
    const { userId, postId } = req.body;

    const result = await deleteLike(userId, postId);

    if (result) {
        return res.json(result);
    }

    return res.status(404).json({
        message: "No like found to delete",
    });
});

module.exports = router;