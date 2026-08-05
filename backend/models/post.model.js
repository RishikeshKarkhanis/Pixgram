const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    caption : { type: String, required: true, default: 'No Caption' },
    imageUrl: { type: String, required: true, default: 'https://firebasestorage.googleapis.com/v0/b/pixgram-469807.firebasestorage.app/o/Post%2FDefault%2FDefaut-Post.jpg?alt=media&token=ea458c51-a8ba-446c-8f43-4461707e2f54' },
    createdAt: { type: Date, default: Date.now },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Post', postSchema);