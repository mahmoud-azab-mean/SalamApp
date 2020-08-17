const User = require('../models/userModel');
module.exports = {
    capitalize: userName => {
        const name = userName.toLowerCase();
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
    updateChatList: async (req, message) => {
        await User.updateOne(
            {
                _id: req.user._id
            },
            {
                $pull: {
                    chatList: {
                        receiverId: req.params.receiverId
                    }
                }
            }
        );

        await User.updateOne(
            {
                _id: req.params.receiverId
            },
            {
                $pull: {
                    chatList: {
                        receiverId: req.user._id
                    }
                }
            }
        );

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
                                messageId: message._id
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
                                messageId: message._id
                            }
                        ],
                        $position: 0
                    }
                }
            }
        );
    }
}