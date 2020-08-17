const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper')
const messageController = require('../controllers/messageController');
router.post('/chat-messages/:senderId/:receiverId', authHelper.verifyToken, messageController.sendMessage);
router.get('/chat-messages/:senderId/:receiverId', authHelper.verifyToken, messageController.getAllMessages);
router.get('/receiver-messages/:senderId/:receiverId', authHelper.verifyToken, messageController.markReceiverMessages);
router.get('/mark-all-messages', authHelper.verifyToken, messageController.markAllMessages);
module.exports = router;