const { Types: { ObjectId } } = require("mongoose");

const postService = require("../services/post.service.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all posts
const getPosts = asyncHandler(async (req, res) => {
    const posts = await postService.getPosts();
    return res.status(200).json(posts);
});

// Create post
const createPost = asyncHandler(async (req, res) => {
    const post = await postService.createPost(req.body);
    return res.status(201).json(post);
});

// Delete post
const deletePost = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
        return res.status(400).json({
            error: "Invalid post ID",
        });
    }

    const post = await postService.deletePost(id);

    if (!post) {
        return res.status(404).json({
            error: "Post not found",
        });
    }

    return res.status(200).json({message: "Post deleted successfully", post});
});

module.exports = { getPosts, createPost, deletePost };
