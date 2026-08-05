const express = require('express');
const Follow = require('../models/follow.model.js');
const User = require('../models/user.model.js');
const {getFollows, createFollow, deleteFollow, isFollowing} = require('../controllers/follow.controller.js');

const router = express.Router();

router.get("/", async (req, res) => {
    getFollows();
    res.send("Get Follow Data");
});

router.post("/isfollowing", async (req, res) => {
    const followData = req.body;
    const data = await Follow.find({follower:followData.follower, following:followData.following});
    if(data[0] != null) {
        return res.json(data[0]);
    }
    if(followData.follower === followData.following) {
        return res.status(200).json({"message":"Own Profile!"})
    }
    else {
        return res.status(404).json({"message":"Follow Not Found!"});
    }
});

router.post("/create", async (req, res) => {
    const followData = req.body;
    const followerId = followData.follower;
    const followingId = followData.following;
    const data = await createFollow(followingId, followerId);

    if(data) {
        res.json(data);
    }
    else {
        res.status(400).json({message:"Error Creating Follow!"});
    }
});

router.delete("/delete", async (req, res) => {
    const followData = req.body;
    const followerId = followData.follower;
    const followingId = followData.following;
    const data = await deleteFollow(followingId, followerId);

    if(data) {
        res.json({"Follow Deleted" : data});
    }
    else {
        res.status(400).json({message:"Error Deleting Follow!"});
    }
});

module.exports = router;