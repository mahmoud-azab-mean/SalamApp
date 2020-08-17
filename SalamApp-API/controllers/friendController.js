const User = require('../models/userModel');
const HttpStatus = require('http-status-codes');
module.exports = {
    followUser(req, res) {
        const followuser = async () => {
            await User.updateOne(
                {
                    _id: req.user._id,
                    'following.userFollowed': { $ne: req.body.userFollowed }
                }
                , {
                    $push: {
                        following: {
                            userFollowed: req.body.userFollowed
                        }
                    }
                });
            await User.updateOne(
                {
                    _id: req.body.userFollowed,
                    'followers.follower': { $ne: req.user._id }
                }
                , {
                    $push: {
                        followers: {
                            follower: req.user._id
                        },
                        notifications: {
                            senderId: req.user._id,
                            action: `${req.user.username} is following you now.`,
                            created: new Date()
                        }
                    }
                });
        }
        followuser()
            .then(() => {
                res.status(HttpStatus.OK)
                    .json({ message: 'you are following user now' });
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' });
            })
    },
    unfollowUser(req, res) {
        const unfollowuser = async () => {
            await User.updateOne(
                {
                    _id: req.user._id
                }
                , {
                    $pull: {
                        following: {
                            userFollowed: req.body.userFollowed
                        }
                    }
                });
            await User.updateOne(
                {
                    _id: req.body.userFollowed
                }
                , {
                    $pull: {
                        followers: {
                            follower: req.user._id
                        }
                    }
                });
        }
        unfollowuser()
            .then(() => {
                res.status(HttpStatus.OK)
                    .json({ message: 'you are unfollowing user now' });
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' });
            })
    },
    async markAsRead(req, res) {
        if (!req.body.deleteIt) {
            await User.updateOne(
                {
                    _id: req.user._id,
                    'notifications._id': req.params.id
                }, {
                $set: {
                    'notifications.$.read': true
                }
            })
                .then(() => {
                    res.status(HttpStatus.OK)
                        .json({ message: 'marked as read' });
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({ message: 'error occured' });
                })
        } else {
            await User.updateOne(
                {
                    _id: req.user._id,
                    'notifications._id': req.params.id
                }, {
                $pull: {
                    notifications: { _id: req.params.id }
                }
            })
                .then(() => {
                    res.status(HttpStatus.OK)
                        .json({ message: 'is deleted' });
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({ message: 'error occured' });
                })
        }
    },
    async markAllAsRead(req, res) {

        await User.updateOne(
            {
                _id: req.user._id
            }, { $set: { 'notifications.$[elem].read': true } },
            { arrayFilters: [{ 'elem.read': false }], multi: true }
        )
            .then(() => {
                res.status(HttpStatus.OK)
                    .json({ message: 'all are marked as read' });
            })
            .catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' });
            })
    }
}
