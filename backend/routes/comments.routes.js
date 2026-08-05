const express = require('express');
const { getComments, createComment, deleteComment, getPostComments } = require('../controllers/comment.controller.js');

const router = express.Router();

router.get("/", (req, res) => {
    getComments();
    res.send("Get all comments");
});

router.get("/:id", async (req, res) => {
    const postId = req.params.id;
    const result = await getPostComments(req, res);
    res.json(result);
});

router.post("/create", async (req, res) => {
    const commentData = req.body;
    const result = await createComment(commentData);
    res.json(result);
});

router.delete("/delete/:id", async (req, res) => {
    const commentId = req.params.id;
    const commentData = req.body;
    const result = await deleteComment(commentId, commentData);
    if(result) {
        res.json(result);
    }
    else {
        res.status(404).json({ message: "No comment found to delete" });
    }
});

module.exports = router;