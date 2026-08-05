const Post = require('../models/post.model.js');
const User = require('../models/user.model.js');
const Comment = require("../models/comment.model.js");
const Like = require("../models/like.model.js");

const getPosts = async () => {
    const posts = await Post.find();
    console.log('Posts retrieved successfully:', posts);
    return posts;
}

const createPost = async (postData) => {
    const result = await Post.create(postData);
    console.log('Post created successfully:', result);

    await User.updateOne(
        { _id: result.postedBy },
        { $inc: { posts: 1 } }
    );

    return result
}

const deletePost = async (postId) => {
    const result = await Post.findByIdAndDelete(postId);
    if (result) {
        console.log('Post deleted successfully:', result);

        await User.updateOne(
            { _id: result.postedBy },
            { $inc: { posts: -1 } });

        await Comment.deleteMany({ postId: postId });
        await Like.deleteMany({ postId: postId });

        return result;
    }
    
    else {
        console.log('Post not found with ID:', postId);
        return null
    }
}

module.exports = { getPosts, createPost, deletePost };