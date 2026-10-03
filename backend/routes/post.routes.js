const express = require("express");

const { getPosts, createPost, deletePost } = require("../controllers/post.controller.js");
const User = require("../models/user.model.js");
const Follow = require("../models/follow.model.js");
const Post = require("../models/post.model.js");
const Like = require("../models/like.model.js");

const router = express.Router();

// Get all posts
router.get("/", getPosts);

// Get posts created by a specific user
router.get("/myposts/:id", async (req, res) => {
    const uid = req.params.id;

    const myPosts = await Post.find({ postedBy: uid })
        .populate("postedBy", "username profilePicture")
        .sort({ createdAt: -1 })
        .lean();

    const postsWithHasLiked = await Promise.all(
        myPosts.map(async (post) => {
            const hasLiked = await Like.exists({
                postId: post._id,
                userId: uid,
            });

            return {
                ...post,
                hasLiked: !!hasLiked,
            };
        }),
    );

    res.json(postsWithHasLiked);
});

// Get feed posts
router.get("/feed/:id", async (req, res) => {
    try {
        const uid = req.params.id;

        // Find users whom this user follows
        const following = await Follow.find({
            follower: uid,
        }).select("following -_id");

        const followingIds = following.map((f) => f.following);

        // Fetch posts from followed users
        const posts = await Post.find({
            postedBy: { $in: followingIds },
        })
            .populate("postedBy", "username profilePicture")
            .sort({ createdAt: -1 })
            .lean();

        // Add hasLiked flag
        const postsWithHasLiked = await Promise.all(
            posts.map(async (post) => {
                const hasLiked = await Like.exists({
                    postId: post._id,
                    userId: uid,
                });

                return {
                    ...post,
                    hasLiked: !!hasLiked,
                };
            }),
        );

        res.json(postsWithHasLiked);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Error fetching feed",
        });
    }
});

// Create post
router.post("/create", createPost);

// Update post
router.put("/update/:id", async (req, res) => {
    const postId = req.params.id;
    const updateData = req.body;

    const result = await Post.findByIdAndUpdate(postId, updateData, {
        new: true,
    });

    if (result) {
        console.log("Post updated:", result);
        res.json(result);
    } else {
        res.status(404).json({
            error: "Post not found",
        });
    }
});

// Delete post
router.delete("/delete/:id", deletePost);

// Get a single post
router.get("/:id", async (req, res) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId)
            .populate("postedBy", "username profilePicture")
            .lean();

        if (!post) {
            return res.status(404).json({
                error: "Post not found",
            });
        }

        const uid = req.user?._doc?._id;

        let hasLiked = false;

        if (uid) {
            const liked = await Like.exists({
                postId: post._id,
                userId: uid,
            });

            hasLiked = !!liked;
        }

        res.json({
            ...post,
            hasLiked,
        });
    } catch (error) {
        console.error("Error fetching single post:", error);

        res.status(500).json({
            error: "Error fetching post",
        });
    }
});

module.exports = router;
