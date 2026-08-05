const express = require('express');
const {getLikes, createLike, deleteLike} = require('../controllers/like.controller.js');
const Like = require('../models/like.model.js');
const Notification = require('../models/notifications.model.js');

const router = express.Router();

router.get('/', async (req, res) => {
    getLikes();
    res.send("The List Of Likes");
});

router.post('/toggle', async (req, res) => {
    const { userId, postId } = req.body;
    const existingLike = await Like.findOne({ userId, postId });

    if (existingLike) {
        const result = await deleteLike(userId, postId);
        if(result) {
            return res.json({"liked":false});
        }
        else {
            return res.status(404).json({ message: "No like found to delete" });
        }
    }

    else {
        const likeData = { userId, postId };
        const result = await createLike(likeData);
        res.json({"liked":true});   
    }
});

router.post('/create', async (req, res) => {
    const likeData = req.body;
    const result = await createLike(likeData);
    
    res.json(result);
});

router.delete('/delete', async (req, res) => {
    const { userId, postId } = req.body;
    const result = await deleteLike(userId, postId);
    if(result) {
        res.json(result);
    }
    else {
        res.status(404).json({ message: "No like found to delete" });
    }
});

module.exports = router;