const User = require('../models/userModel');
const HttpStatus = require('http-status-codes');
const Joi = require('@hapi/joi');
const bcrypt = require('bcryptjs');
module.exports = {
    async getAllUsers(req, res) {
        await User.find({})
            .populate('posts.postId')
            .populate('following.userFollowed')
            .populate('followers.follower')
            .populate('chatList.receiverId')
            .populate('chatList.messageId')
            .then(result => {
                res.status(HttpStatus.OK)
                    .json({ message: 'all users', result })
            }).catch(() => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' })
            })
    },
    async getUser(req, res) {
        await User.findOne({ _id: req.params.id })
            .populate('posts.postId')
            .populate('following.userFollowed')
            .populate('followers.follower')
            .populate('chatList.receiverId')
            .populate('chatList.messageId')
            .populate('notifications.senderId')
            .then(result => {
                res.status(HttpStatus.OK)
                    .json({ message: 'user by id', result })
            }).catch(() => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' })
            })
    },
    async changePassword(req, res) {
        const schema = Joi.object({
            cPassword: Joi.string().required(),
            newPassword: Joi.string()
                .min(5)
                .required(),
            confirmPassword: Joi.string()
                .min(5)
                .required()
        });

        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(httpStatus.BAD_REQUEST).json({ msg: error.details });
        }

        const user = await User.findOne({ _id: req.user._id });

        return bcrypt.compare(value.cPassword, user.password).then(async result => {

            if (!result) {
                return res
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'Current password is incorrect' });
            }

            const newPassword = await User.encryptPassword(req.body.newPassword);
            await User.updateOne(
                {
                    _id: req.user._id
                },
                {
                    password: newPassword
                }
            )
                .then(() => {
                    res
                        .status(HttpStatus.OK)
                        .json({ message: 'Password changed successfully' });
                })
                .catch(err => {
                    res
                        .status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({ message: 'Error occured' });
                });
        });
    }
}