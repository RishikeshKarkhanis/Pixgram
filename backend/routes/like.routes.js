const express = require("express");

const {
    getLikes,
    createLike,
    deleteLike,
    toggleLike,
} = require("../controllers/like.controller.js");

const router = express.Router();

// Get all likes
router.get("/", getLikes);

// Toggle like
router.post("/toggle", toggleLike);

// Create like
router.post("/create", createLike);

// Delete like
router.delete("/delete", deleteLike);

module.exports = router;
