const express = require('express');
const { getPosts, createPost, deletePost } = require('../controllers/post.controller.js');
const User = require('../models/user.model.js');
const Follow = require('../models/follow.model.js');
const Post = require('../models/post.model.js');
const Like = require('../models/like.model.js');


const router = express.Router();

router.get('/', async (req, res) => {
    const posts = await getPosts();
    res.json(posts);
});


router.get('/myposts/:id', async (req, res) => {
    const uid = req.params.id;

    const myPosts = await Post.find({postedBy: uid})
    .populate('postedBy', 'username profilePicture')
    .sort({ createdAt: -1 }).lean();

    const postsWithHasLiked = await Promise.all(
        myPosts.map(async (post) => {
            const hasLiked = await Like.exists({
                postId: post._id,
                userId: uid
            });

            return {
                ...post,
                hasLiked: !!hasLiked   // 👈 frontend can now use this
            };
        })
    );

    res.json(postsWithHasLiked);
});

router.get('/feed/:id', async (req, res) => {
    try {
        const uid = req.params.id;

        // find whom the user is following
        const following = await Follow.find({ follower: uid }).select('following -_id');
        const followingIds = following.map(f => f.following);

        // fetch posts from followed users
        const posts = await Post.find({ postedBy: { $in: followingIds } })
            .populate('postedBy', 'username profilePicture')
            .sort({ createdAt: -1 })
            .lean();  // return plain JS objects (easy to modify)

        // add hasLiked flag to each post
        const postsWithHasLiked = await Promise.all(
            posts.map(async (post) => {
                const hasLiked = await Like.exists({
                    postId: post._id,
                    userId: uid
                });

                return {
                    ...post,
                    hasLiked: !!hasLiked   // 👈 frontend can now use this
                };
            })
        );

        res.json(postsWithHasLiked);
    }

    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching feed' });
    }
});

router.post('/create', async (req, res) => {
    const postData = req.body;
    const data = await createPost(postData);
    res.json(data);
});

router.put('/update/:id', async (req, res) => {
    const postId = req.params.id;
    const updateData = req.body;

    const result = await Post.findByIdAndUpdate(postId, updateData, { new: true });
    if (result) {
        console.log("Post updated:", result);
        
        res.json(result);
    } else {
        res.status(404).json({ error: 'Post not found' });
    }
});

router.delete('/delete/:id', async (req, res) => {
    const postId = req.params.id;
    const data = await deletePost(postId);
    if(data) {
        res.json(data);
    }
    else {
        res.status(404).json({ message: "No post found to delete" });
    }
});

module.exports = router;