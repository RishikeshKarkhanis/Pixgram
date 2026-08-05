const User = require('../models/user.model.js');
const Comment = require("../models/comment.model.js");
const Like = require("../models/like.model.js");
const Post = require("../models/post.model.js");
const Follow = require("../models/follow.model.js");
const { v4: uuidv4 } = require('uuid');
const { setUser, getUser } = require('../services/auth.js');

const getUsers = async () => {
    const users = await User.find();
    console.log('Users retrieved successfully:', users);
}

const createUser = async (userData) => {
    try {
        const result = await User.create(userData);
        console.log('User created successfully:', result);
        return result;
    }
    catch (error) {
        console.error('Error creating user:', error);
        return null;
    }

}

const loginUser = async (req, res) => {
    const userData = req.body;
    const user = await User.findOne(userData);

    if (!user) {
        console.log('Login failed: Invalid credentials');
        return null;
    }

    const token = setUser(user);
    res.cookie('uid', token);

    console.log('Login successful for user:', user.username);
    return user;
}

const deleteUser = async (userId) => {
    const result = await User.findByIdAndDelete(userId);
    if (!result) return null;

    const userPosts = await Post.find({ postedBy: userId });

    for (const post of userPosts) {
        await Comment.deleteMany({ post: post._id });
        await Like.deleteMany({ post: post._id });
    }

    const userFollows = await Follow.find({
        $or: [{ follower: userId }, { following: userId }]
    });

    for (const f of userFollows) {
        if (f.follower.toString() === userId.toString()) {
            // deleted user was the follower
            await User.findByIdAndUpdate(f.following, { $inc: { followers: -1 } });
        }
        if (f.following.toString() === userId.toString()) {
            // deleted user was being followed
            await User.findByIdAndUpdate(f.follower, { $inc: { following: -1 } });
        }
    }

    const userComments = await Comment.find({userId:userId});

    for(const c of userComments) {
        const pid = c.postId;
        await Post.findByIdAndUpdate(pid, { $inc: { comments: -1 } });
    }

    const userLikes = await Like.find({userId:userId});

    for(const l of userLikes) {
        const pid = l.postId;
        await Post.findByIdAndUpdate(pid, { $inc: { likes: -1 } });
    }

    await Post.deleteMany({ postedBy: userId });

    await Comment.deleteMany({ userId: userId });
    await Like.deleteMany({ userId: userId });

    await Follow.deleteMany({ $or: [{ follower: userId }, { following: userId }] });

    return result;
}

const updateUser = async (userId, userData) => {
    const result = await User.findByIdAndUpdate(userId, userData, { new: true });
    console.log('User updated successfully:', result);
    return result;
}

module.exports = { createUser, getUsers, deleteUser, updateUser, loginUser };