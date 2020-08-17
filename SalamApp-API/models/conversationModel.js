const mongoose = require('mongoose');
const conversationSchema = mongoose.Schema({
    participants: [
        {
            senderId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
            receiverId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
        }
    ]
});
module.exports = mongoose.model('Conversation', conversationSchema);