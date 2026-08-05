const Follow = require('../models/follow.model.js');
const User = require('../models/user.model.js');

const getFollows = async () => {
    const follows = await Follow.find({});
    console.log('Follows retrieved successfully:', follows);
}

const isFollowing = async (followingId, followerId) => {
    const data = await Follow.find({follower:followerId, following:followingId});
    console.log(data[0]);
    if(data[0]) {
        return data[0];
    }
    else {
        return null
    }
}

const createFollow = async (followingId, followerId) => {
    const result = await Follow.create({"follower": followerId, "following": followingId});

    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    console.log(`User ${follower.username} is now following ${following.username}`);

    await User.updateOne(
        { _id: followingId },
        { $inc: { followers: 1 } }
    );

    await User.updateOne(
        { _id: followerId },
        { $inc: { following: 1 } }
    );

    return result;
}

const deleteFollow = async (followingId, followerId) => {
    const result = await Follow.find({"follower": followerId, "following": followingId});
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);
    const data = await Follow.deleteOne({"follower": followerId, "following": followingId});
    console.log(`User ${follower.username} unfollowed ${following.username}`);

    await User.updateOne(
        { _id: followingId },
        { $inc: { followers: -1 } }
    );

    await User.updateOne(
        { _id: followerId },
        { $inc: { following: -1 } }
    );

    return data;
}

module.exports = {getFollows, createFollow, deleteFollow, isFollowing};