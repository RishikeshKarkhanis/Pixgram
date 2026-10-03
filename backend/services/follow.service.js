const Follow = require("../models/follow.model.js");
const User = require("../models/user.model.js");
const notificationService = require("./notification.service.js");

const getFollows = async () => {
    const follows = await Follow.find({});

    console.log("Follows retrieved successfully:", follows);

    return follows;
};

const isFollowing = async (followingId, followerId) => {
    const follow = await Follow.findOne({
        follower: followerId,
        following: followingId,
    });

    return follow || null;
};

const createFollow = async (followingId, followerId) => {
    const result = await Follow.create({
        follower: followerId,
        following: followingId,
    });

    await User.updateOne(
        { _id: followingId },
        { $inc: { followers: 1 } }
    );

    await User.updateOne(
        { _id: followerId },
        { $inc: { following: 1 } }
    );

    await notificationService.createNotification({
        recipient: followingId,
        sender: followerId,
        type: "follow",
    });

    console.log(`User ${followerId} is now following ${followingId}`);

    return result;
};

const deleteFollow = async (followingId, followerId) => {
    const result = await Follow.deleteOne({
        follower: followerId,
        following: followingId,
    });

    if (result.deletedCount > 0) {
        await User.updateOne({ _id: followingId }, { $inc: { followers: -1 } });

        await User.updateOne({ _id: followerId }, { $inc: { following: -1 } });
    }

    console.log(`User ${followerId} unfollowed ${followingId}`);

    return result;
};

module.exports = {
    getFollows,
    createFollow,
    deleteFollow,
    isFollowing,
};
