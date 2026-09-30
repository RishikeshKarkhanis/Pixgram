const { Types: { ObjectId } } = require('mongoose');

const commentService = require('../services/comment.service.js');

const getComments = async (req, res) => {
    try {
        const comments = await commentService.getComments();

        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error retrieving comments:', error);

        return res.status(500).json({
            error: 'Failed to retrieve comments'
        });
    }
};

const getPostComments = async (req, res) => {
    try {
        const postId = req.params.id;

        if (!ObjectId.isValid(postId)) {
            return res.status(400).json({
                error: 'Invalid post ID'
            });
        }

        const comments = await commentService.getPostComments(postId);

        return res.status(200).json(comments);
    } catch (error) {
        console.error('Error retrieving post comments:', error);

        return res.status(500).json({
            error: 'Failed to retrieve post comments'
        });
    }
};

const createComment = async (req, res) => {
    try {
        const comment = await commentService.createComment(req.body);

        return res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);

        return res.status(500).json({
            error: 'Failed to create comment'
        });
    }
};

const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.id;

        if (!ObjectId.isValid(commentId)) {
            return res.status(400).json({
                error: 'Invalid comment ID'
            });
        }

        const result = await commentService.deleteComment(commentId);

        if (!result) {
            return res.status(404).json({
                error: 'Comment not found'
            });
        }

        return res.status(200).json({
            message: 'Comment deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting comment:', error);

        return res.status(500).json({
            error: 'Failed to delete comment'
        });
    }
};

module.exports = {
    getComments,
    getPostComments,
    createComment,
    deleteComment
};