const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    following: { type:Number, default: 0 },
    followers: { type:Number, default: 0 },
    profilePicture: { type: String, default:"https://firebasestorage.googleapis.com/v0/b/pixgram-469807.firebasestorage.app/o/User%2FProfilePictures%2FDefault%2Fdefault.webp?alt=media&token=fae64a84-57b3-4637-990f-349dd6d91207" },
    posts:{type:Number, default: 0},
    bio: { type: String, default: '' }
});

module.exports = mongoose.model('User', userSchema); // ✅ model exported