const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = mongoose.Schema(
    {
        username: { type: String },
        email: { type: String },
        password: { type: String },
        posts: [
            {
                postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
                post: { type: String },
                created: { type: Date, default: Date.now }
            }
        ],
        following: [
            {
                userFollowed: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        followers: [
            {
                follower: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'User'
                }
            }
        ],
        notifications: [
            {
                senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                action: { type: String },
                viewProfile: { type: Boolean, default: false },
                created: { type: Date, default: Date.now },
                read: { type: Boolean, default: false },
                date: { type: String, default: '' }
            }
        ],
        chatList: [
            {
                receiverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                messageId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message' },
            }
        ],
        photoVersion: { type: String, default: '1587898246' },
        photoId: { type: String, default: 'aiv0zyj8h946msvbzdca' },
        photos: [
            {
                photoVersion: { type: String, default: '' },
                photoId: { type: String, default: '' }
            }
        ],
        country: { type: String, default: '' },
        city: { type: String, default: '' }
    }
);
userSchema.statics.encryptPassword = async (password) => {
    const hash = await bcrypt.hash(password, 10);
    return hash;
}
module.exports = mongoose.model('User', userSchema)
