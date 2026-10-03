const Comment = require("../models/comment.model.js");
const Post = require("../models/post.model.js");
const notificationService = require("./notification.service.js");

const getComments = async () => {
    const comments = await Comment.find({});
    console.log("Comments retrieved successfully:", comments);

    return comments;
};

const getPostComments = async (postId) => {
    const comments = await Comment.find({ postId })
        .populate("userId", "username profilePicture")
        .sort({ createdAt: -1 })
        .lean();

    console.log(
        `Comments for post ${postId} retrieved successfully:`,
        comments,
    );

    return comments;
};

const createComment = async (commentData) => {
    const result = await Comment.create(commentData);

    console.log("Comment created successfully:", result);

    await Post.updateOne(
        { _id: commentData.postId },
        { $inc: { comments: 1 } },
    );

    const post = await Post.findById(commentData.postId)
        .select("postedBy");

    if (
        post &&
        String(post.postedBy) !== String(commentData.userId)
    ) {
        await notificationService.createNotification({
            recipient: post.postedBy,
            sender: commentData.userId,
            type: "comment",
            post: commentData.postId,
            comment: result._id,
        });
    }

    return result;
};

const deleteComment = async (commentId) => {
    const comment = await Comment.findById(commentId);

    if (!comment) {
        return null;
    }

    const result = await Comment.deleteOne({ _id: commentId });

    if (result.deletedCount > 0) {
        await Post.updateOne(
            { _id: comment.postId },
            { $inc: { comments: -1 } },
        );
    }

    return result;
};

module.exports = {
    getComments,
    getPostComments,
    createComment,
    deleteComment,
};
