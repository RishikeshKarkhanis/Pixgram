const {Types: { ObjectId } } = require("mongoose");

const commentService = require("../services/comment.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all comments
const getComments = asyncHandler(async (req, res) => {
    const comments = await commentService.getComments();
    return res.status(200).json(comments);
});

// Get comments for a specific post
const getPostComments = asyncHandler(async (req, res) => {
    const postId = req.params.id;

    if (!ObjectId.isValid(postId)) {
        return res.status(400).json({
            error: "Invalid post ID",
        });
    }

    const comments = await commentService.getPostComments(postId);
    return res.status(200).json(comments);
});

// Create comment
const createComment = asyncHandler(async (req, res) => {
    const comment = await commentService.createComment(req.body);
    return res.status(201).json(comment);
});

// Delete comment
const deleteComment = asyncHandler(async (req, res) => {
    const commentId = req.params.id;

    if (!ObjectId.isValid(commentId)) {
        return res.status(400).json({
            error: "Invalid comment ID",
        });
    }

    const result = await commentService.deleteComment(commentId);

    if (!result) {
        return res.status(404).json({
            error: "Comment not found",
        });
    }

    return res.status(200).json({ message: "Comment deleted successfully" });
});

module.exports = { getComments, getPostComments, createComment, deleteComment };
