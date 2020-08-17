const mongoose = require('mongoose');
const messageSchema = mongoose.Schema({
    conversationId: { type: mongoose.SchemaTypes.ObjectId, ref: 'Conversation' },
    sender: { type: String },
    receiver: { type: String },
    messages: [
        {
            senderId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
            receiverId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
            senderName: { type: String },
            receiverName: { type: String },
            body: { type: String, default: '' },
            isRead: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }
    ]
});
module.exports = mongoose.model('Message', messageSchema);