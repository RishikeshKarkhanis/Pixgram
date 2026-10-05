const User = require("../models/user.model.js");
const Comment = require("../models/comment.model.js");
const Like = require("../models/like.model.js");
const Post = require("../models/post.model.js");
const Follow = require("../models/follow.model.js");

const messageService = require("./message.service.js");

const { setUser } = require("../utils/auth.js");

const getUsers = async () => {
    const users = await User.find();

    console.log("Users retrieved successfully:", users);

    return users;
};

const createUser = async (userData) => {
    const result = await User.create(userData);

    console.log("User created successfully:", result);

    return result;
};

const loginUser = async (userData) => {
    const user = await User.findOne(userData);

    if (!user) {
        console.log("Login failed: Invalid credentials");
        return null;
    }

    const token = setUser(user);

    console.log("Login successful for user:", user.username);

    return {
        user,
        token,
    };
};

const deleteUser = async (userId) => {
    // Find user
    const user = await User.findById(userId);

    if (!user) {
        return null;
    }

    /*
     * --------------------------------------------------
     * Delete user's posts and their associated data
     * --------------------------------------------------
     */

    const userPosts = await Post.find({
        postedBy: userId,
    });

    for (const post of userPosts) {
        await Comment.deleteMany({
            postId: post._id,
        });

        await Like.deleteMany({
            postId: post._id,
        });
    }

    /*
     * --------------------------------------------------
     * Delete user's follows
     * --------------------------------------------------
     */

    const userFollows = await Follow.find({
        $or: [{ follower: userId }, { following: userId }],
    });

    for (const follow of userFollows) {
        // Deleted user was following someone
        if (follow.follower.toString() === userId.toString()) {
            await User.findByIdAndUpdate(follow.following, {
                $inc: { followers: -1 },
            });
        }

        // Someone was following deleted user
        if (follow.following.toString() === userId.toString()) {
            await User.findByIdAndUpdate(follow.follower, {
                $inc: { following: -1 },
            });
        }
    }

    /*
     * --------------------------------------------------
     * Update post comment counters
     * --------------------------------------------------
     */

    const userComments = await Comment.find({
        userId,
    });

    for (const comment of userComments) {
        await Post.findByIdAndUpdate(comment.postId, {
            $inc: { comments: -1 },
        });
    }

    /*
     * --------------------------------------------------
     * Update post like counters
     * --------------------------------------------------
     */

    const userLikes = await Like.find({
        userId,
    });

    for (const like of userLikes) {
        await Post.findByIdAndUpdate(like.postId, {
            $inc: { likes: -1 },
        });
    }

    /*
     * --------------------------------------------------
     * Delete posts
     * --------------------------------------------------
     */

    await Post.deleteMany({
        postedBy: userId,
    });

    /*
     * --------------------------------------------------
     * Delete user's comments, likes and follows
     * --------------------------------------------------
     */

    await Comment.deleteMany({
        userId,
    });

    await Like.deleteMany({
        userId,
    });

    await Follow.deleteMany({
        $or: [{ follower: userId }, { following: userId }],
    });

    /*
     * --------------------------------------------------
     * Delete user's messages / chats
     * --------------------------------------------------
     */

    await messageService.deleteMessagesForUser(userId);

    /*
     * --------------------------------------------------
     * Finally delete user
     * --------------------------------------------------
     */

    const result = await User.findByIdAndDelete(userId);

    return result;
};

const updateUser = async (userId, userData) => {
    const result = await User.findByIdAndUpdate(userId, userData, {
        new: true,
    });

    console.log("User updated successfully:", result);

    return result;
};

module.exports = {
    getUsers,
    createUser,
    loginUser,
    deleteUser,
    updateUser,
};