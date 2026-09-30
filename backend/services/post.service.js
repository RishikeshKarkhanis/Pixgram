const Post = require("../models/post.model.js");
const User = require("../models/user.model.js");
const Comment = require("../models/comment.model.js");
const Like = require("../models/like.model.js");

const getPosts = async () => {
    const posts = await Post.find();

    console.log("Posts retrieved successfully:", posts);

    return posts;
};

const createPost = async (postData) => {
    const result = await Post.create(postData);

    console.log("Post created successfully:", result);

    await User.updateOne({ _id: result.postedBy }, { $inc: { posts: 1 } });

    return result;
};

const deletePost = async (postId) => {
    const result = await Post.findByIdAndDelete(postId);

    if (!result) {
        console.log("Post not found with ID:", postId);
        return null;
    }

    console.log("Post deleted successfully:", result);

    // Decrease user's post count
    await User.updateOne({ _id: result.postedBy }, { $inc: { posts: -1 } });

    // Delete associated comments
    await Comment.deleteMany({
        postId,
    });

    // Delete associated likes
    await Like.deleteMany({
        postId,
    });

    return result;
};

module.exports = {
    getPosts,
    createPost,
    deletePost,
};
