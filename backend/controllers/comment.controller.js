const Comment = require('../models/comment.model.js');
const Post = require('../models/post.model.js');
const { Types: { ObjectId } } = require('mongoose');

const getComments = async (req, res) => {
    const comments = await Comment.find({});
    console.log('Comments retrieved successfully:', comments);
};

const getPostComments = async (req, res) => {
    const postId = req.params.id;
    if (!ObjectId.isValid(postId)) {
        return res.status(400).json({ error: 'Invalid post ID' });
    }

    const comments = await Comment.find({ postId: postId })
        .populate('userId', 'username profilePicture')
        .sort({ createdAt: -1 })
        .lean();  // return plain JS objects (easy to modify);
    console.log(`Comments for post ${postId} retrieved successfully:`, comments);
    return comments;
}

const createComment = async (commentData) => {
    const result = await Comment.create(commentData);
    console.log('Comment created successfully:', result);

    await Post.updateOne(
        { _id: commentData.postId },
        { $inc: { comments: 1 } }
    );

    return result;
};

const deleteComment = async (commentId, commentData) => {
    const result = await Comment.deleteOne({ _id: commentId });
    if (result.deletedCount > 0) {
        console.log(result);

        await Post.updateOne(
            { _id: commentData.postId },
            { $inc: { comments: -1 } }
        );

        return result
    } else {
        console.log('No comment found to delete');
        return null;
    }
};

module.exports = { getComments, createComment, deleteComment, getPostComments };