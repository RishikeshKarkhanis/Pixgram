const { Types: { ObjectId } } = require('mongoose');

const postService = require('../services/post.service.js');

const getPosts = async (req, res) => {
    try {
        const posts = await postService.getPosts();

        return res.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error);

        return res.status(500).json({
            error: 'Failed to retrieve posts'
        });
    }
};

const createPost = async (req, res) => {
    try {
        const post = await postService.createPost(req.body);

        return res.status(201).json(post);
    } catch (error) {
        console.error('Error creating post:', error);

        return res.status(500).json({
            error: 'Failed to create post'
        });
    }
};

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id)) {
            return res.status(400).json({
                error: 'Invalid post ID'
            });
        }

        const post = await postService.deletePost(id);

        if (!post) {
            return res.status(404).json({
                error: 'Post not found'
            });
        }

        return res.status(200).json({
            message: 'Post deleted successfully',
            post
        });
    } catch (error) {
        console.error('Error deleting post:', error);

        return res.status(500).json({
            error: 'Failed to delete post'
        });
    }
};

module.exports = {
    getPosts,
    createPost,
    deletePost
};