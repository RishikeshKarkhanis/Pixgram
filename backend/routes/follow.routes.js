const express = require('express');

const {
    getFollows,
    createFollow,
    deleteFollow,
    isFollowing
} = require('../controllers/follow.controller.js');

const router = express.Router();


// ==================== FOLLOW ROUTES ====================

// Get all follows
router.get('/', getFollows);


// Check if user is following another user
router.post('/isfollowing', isFollowing);


// Create follow
router.post('/create', async (req, res) => {
    const followData = req.body;

    const followerId = followData.follower;
    const followingId = followData.following;

    const data = await createFollow(
        followingId,
        followerId
    );

    if (data) {
        return res.json(data);
    }

    return res.status(400).json({
        message: "Error Creating Follow!"
    });
});


// Delete follow
router.delete('/delete', async (req, res) => {
    const followData = req.body;

    const followerId = followData.follower;
    const followingId = followData.following;

    const data = await deleteFollow(
        followingId,
        followerId
    );

    if (data) {
        return res.json({
            "Follow Deleted": data
        });
    }

    return res.status(400).json({
        message: "Error Deleting Follow!"
    });
});


module.exports = router;