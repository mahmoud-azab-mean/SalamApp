const mongoose = require('mongoose');
const HttpStatus = require('http-status-codes');
const Conversation = require('../models/conversationModel');
const Message = require('../models/messageModel');
const User = require('../models/userModel');
const Helper = require('../helpers/helper');

module.exports = {
    async getAllMessages(req, res) {
        const { senderId, receiverId } = req.params;
        const conversation = await Conversation.findOne({
            $or: [
                {
                    $and: [
                        { 'participants.senderId': senderId },
                        { 'participants.receiverId': receiverId }

                    ]
                },
                {
                    $and: [
                        { 'participants.receiverId': senderId },
                        { 'participants.senderId': receiverId }

                    ]
                }
            ]
        }).select('_id');
        if (conversation) {
            const message = await Message.findOne({
                conversationId: conversation._id
            });
            res.status(HttpStatus.OK)
                .json({ message: 'Message returned', message });
        }
    },
    sendMessage(req, res) {
        const { senderId, receiverId } = req.params;
        Conversation.find(
            {
                $or: [
                    {
                        participants: {
                            $elemMatch: { senderId: senderId, receiverId: receiverId }
                        }
                    },
                    {
                        participants: {
                            $elemMatch: { senderId: receiverId, receiverId: senderId }
                        }
                    }
                ]
            }, async (err, result) => {
                if (result.length > 0) {
                    const msg = await Message.findOne({
                        conversationId: result[0]._id
                    });
                    Helper.updateChatList(req, msg);
                    await Message.updateOne(
                        {
                            conversationId: result[0]._id
                        },
                        {
                            $push: {
                                messages: {
                                    senderId: req.user._id,
                                    receiverId: req.params.receiverId,
                                    senderName: req.user.username,
                                    receiverName: req.body.receiverName,
                                    body: req.body.message
                                }
                            }
                        }
                    )
                        .then(() =>
                            res
                                .status(HttpStatus.OK)
                                .json({ message: 'Message sent successfully' })
                        )
                        .catch(err =>
                            res
                                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .json({ message: 'Error occured' })
                        );

                } else {
                    const newConversation = new Conversation();
                    newConversation.participants.push({
                        senderId: req.user._id,
                        receiverId: req.params.receiverId
                    });
                    const saveConversation = await newConversation.save();

                    const newMessage = new Message();
                    newMessage.conversationId = saveConversation._id;
                    newMessage.sender = req.user.username;
                    newMessage.receiver = req.body.receiverName;
                    newMessage.messages.push({
                        senderId: req.user._id,
                        receiverId: req.params.receiverId,
                        senderName: req.user.username,
                        receiverName: req.body.receiverName,
                        body: req.body.message
                    });

                    await User.updateOne(
                        {
                            _id: req.user._id
                        },
                        {
                            $push: {
                                chatList: {
                                    $each: [
                                        {
                                            receiverId: req.params.receiverId,
                                            messageId: newMessage._id
                                        }
                                    ],
                                    $position: 0
                                }
                            }
                        }
                    );

                    await User.updateOne(
                        {
                            _id: req.params.receiverId
                        },
                        {
                            $push: {
                                chatList: {
                                    $each: [
                                        {
                                            receiverId: req.user._id,
                                            messageId: newMessage._id
                                        }
                                    ],
                                    $position: 0
                                }
                            }
                        }
                    );
                    await newMessage
                        .save()
                        .then(() => {
                            res.status(HttpStatus.OK)
                                .json({ message: 'Message sent' })
                        }
                        )
                        .catch(err =>
                            res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                .json({ message: 'Error occured' })
                        );
                }
            }
        )
    },
    async markReceiverMessages(req, res) {
        const { senderId, receiverId } = req.params;
        const msgs = await Message.aggregate([
            { $unwind: '$messages' },
            {
                $match: {
                    $and: [
                        {
                            'messages.senderId': new mongoose.Types.ObjectId(senderId)
                        }
                        , {
                            'messages.receiverId': new mongoose.Types.ObjectId(receiverId)
                        }
                    ]
                }
            }
        ]);
        if (msgs.length > 0) {

            try {
                msgs.forEach(async element => {
                    await Message.updateOne(
                        {
                            'messages._id': element.messages._id
                        },
                        { $set: { 'messages.$.isRead': true } } //  $ first index match the query condition
                    );
                });
                res.status(HttpStatus.OK).json({ message: 'Messages marked as read' });
            } catch (err) {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured' });
            }
        }
    },
    async markAllMessages(req, res) {
        const msgs = await Message.aggregate([
            { $unwind: '$messages' },
            {
                $match: {
                    'messages.receiverId': new mongoose.Types.ObjectId(req.user._id)
                }
            }
        ]);
        if (msgs.length > 0) {

            try {
                msgs.forEach(async element => {
                    await Message.updateOne(
                        {
                            'messages._id': element.messages._id
                        },
                        { $set: { 'messages.$.isRead': true } } //  $ first index match the query condition
                    );
                });
                res.status(HttpStatus.OK).json({ message: 'All messages marked as read' });
            } catch (err) {
                res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Error occured' });
            }
        }
    }
}