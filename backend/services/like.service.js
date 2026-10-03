const Like = require("../models/like.model.js");
const Post = require("../models/post.model.js");
const notificationService = require("./notification.service.js");

const getLikes = async () => {
    const likes = await Like.find({});

    console.log("Likes retrieved successfully:", likes);

    return likes;
};

const createLike = async (likeData) => {
    const result = await Like.create(likeData);

    await Post.updateOne(
        { _id: likeData.postId },
        { $inc: { likes: 1 } }
    );

    const post = await Post.findById(likeData.postId)
        .select("postedBy");

    if (
        post &&
        String(post.postedBy) !== String(likeData.userId)
    ) {
        await notificationService.createNotification({
            recipient: post.postedBy,
            sender: likeData.userId,
            type: "like",
            post: likeData.postId,
        });
    }

    console.log("Like created successfully:", result);

    return result;
};

const deleteLike = async (userId, postId) => {
    const result = await Like.deleteOne({
        userId,
        postId,
    });

    if (result.deletedCount > 0) {
        console.log("Like deleted successfully");

        await Post.updateOne({ _id: postId }, { $inc: { likes: -1 } });

        return result;
    }

    console.log("No like found to delete");

    return null;
};

const findLike = async (userId, postId) => {
    return await Like.findOne({
        userId,
        postId
    });
};

module.exports = {
    getLikes,
    createLike,
    deleteLike,
    findLike
};
