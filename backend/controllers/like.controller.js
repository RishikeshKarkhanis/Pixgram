const Like = require('../models/like.model.js');
const Post = require('../models/post.model.js');

const getLikes = async () => {
    const likes = await Like.find({});
    console.log('Likes retrieved successfully:', likes);
}

const createLike = async (likeData) => {
    const result = await Like.create(likeData);
    
    await Post.updateOne(
        { _id: likeData.postId },
        { $inc: { likes: 1 } }
    );

    console.log('Like created successfully:', result);
    return result;
}

const deleteLike = async (userId, postId) => {
    const result = await Like.deleteOne({ userId, postId });
    if (result.deletedCount > 0) {
        console.log('Like deleted successfully');
        await Post.updateOne({ _id: postId }, { $inc: { likes: -1 } });
        return result;
    }
    else {
        console.log('No like found to delete');
        return null;
    }
}

module.exports = { getLikes, createLike, deleteLike };