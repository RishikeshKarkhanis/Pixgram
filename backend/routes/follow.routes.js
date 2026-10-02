const express = require("express");

const {
    getFollows,
    createFollow,
    deleteFollow,
    isFollowing,
} = require("../controllers/follow.controller.js");

const router = express.Router();

router.get("/", getFollows);

router.post("/isfollowing", isFollowing);

router.post("/create", createFollow);

router.delete("/delete", deleteFollow);

module.exports = router;
