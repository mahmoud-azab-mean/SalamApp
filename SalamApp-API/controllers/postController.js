const Joi = require('@hapi/joi');
const Post = require('../models/postModel');
const User = require('../models/userModel');
const HttpStatus = require('http-status-codes');
const moment = require('moment');
const cloudinary = require('cloudinary').v2;
const request = require('request');
cloudinary.config({
    cloud_name: 'dxpxowuoc',
    api_key: '197789121424996',
    api_secret: 'QhwC-vNVS9W1svrkQav3C2PAo2c'
});
module.exports = {
    addPost(req, res) {
        const schema = Joi.object({
            post: Joi.string().regex(/^[a-zA-Z](.*[a-zA-Z0-9])?$/).required().messages(
                {
                    'string.pattern.base': 'post should be a text '

                })
        });
        const postBody = {
            post: req.body.post
        }
        const { error } = schema.validate(postBody);
        if (error) {
            return res.status(HttpStatus.CONFLICT).json({ msg: error.details });
        }

        const post = {
            user: req.user._id,
            username: req.user.username,
            post: req.body.post,
            created: new Date()
        }

        if (req.body.post && !req.body.photo) {
            Post.create(post).then(async (post) => {
                await User.updateOne({ _id: req.user._id }, {
                    $push: {
                        posts: {
                            postId: post._id,
                            post: req.body.post,
                            created: new Date()
                        }
                    }
                })
                res.status(HttpStatus.CREATED)
                    .json({ message: 'post created', post })
            }).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' })
            });
        }

        if (req.body.post && req.body.photo) {
            cloudinary.uploader.upload(req.body.photo,
                {
                    transformation: {
                        width: 500, height: 400
                    }
                }, async (error, result) => {
                    const post = {
                        user: req.user._id,
                        username: req.user.username,
                        post: req.body.post,
                        photoVersion: result.version,
                        photoId: result.public_id,
                        created: new Date()
                    }
                    Post.create(post).then(async (post) => {
                        await User.updateOne({ _id: req.user._id }, {
                            $push: {
                                posts: {
                                    postId: post._id,
                                    post: req.body.post,
                                    created: new Date()
                                }
                            }
                        })
                        res.status(HttpStatus.CREATED)
                            .json({ message: 'post created', post })
                    }).catch(err => {
                        res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .json({ message: 'error occured' })
                    });
                });

        }


    },
    async getPosts(req, res) {
        try {
            const currentDate = moment().startOf('day');
            const endDate = moment(currentDate).subtract(3, 'M');
            const posts = await Post.find({})
                .populate('user')
                .sort({ created: -1 });
            const topPosts = await Post.find({
                totalLikes: { $gte: 2 },
                created: { $gte: endDate.toDate() }
            })
                .populate('user')
                .sort({ totalLikes: -1, created: -1 });
            const user = await User.findOne(
                {
                    _id: req.user._id
                });

            if (user.country === '' && user.city === '') {
                request('https://geolocation-db.com/json',
                    { json: true }, async (err, res, body) => {
                        await User.updateOne(
                            { _id: req.user._id }
                            ,
                            {
                                country: body.country_name,
                                city: body.city
                            }

                        )
                    }
                );
            }
            return res.status(HttpStatus.OK)
                .json({ message: 'All posts', posts, topPosts });
        } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'error in getting posts' });
        }
    },

    async addLike(req, res) {
        const postId = req.body._id;
        await Post.updateOne(
            {
                _id: postId,
                'likes.username': { $ne: req.user.username }
            }
            , {
                $push: {
                    likes: {
                        username: req.user.username
                    }
                },
                $inc: {
                    totalLikes: 1
                }

            }).then(
                () => {
                    res.status(HttpStatus.OK)
                        .json({ message: 'you liked this post' });
                }
            ).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' });
            })
    },
    async addComment(req, res) {
        const postId = req.body.postId;
        await Post.updateOne(
            {
                _id: postId
            }
            , {
                $push: {
                    comments: {
                        userId: req.user._id,
                        username: req.user.username,
                        comment: req.body.comment,
                        createdAt: new Date()
                    }
                }
            }).then(
                () => {
                    res.status(HttpStatus.OK)
                        .json({ message: 'comment added to post' });
                }
            ).catch(err => {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message: 'error occured' });
            })
    },
    async getPost(req, res) {
        await Post.findOne({ _id: req.params.id })
            .populate('user')
            .populate('comments.userId')
            .then(post => {
                res.status(HttpStatus.OK)
                    .json({ message: 'post found', post });
            }).catch(err => {
                res.status(HttpStatus.NOT_FOUND)
                    .json({ message: 'post not found' });
            })
    },
    async editPost(req, res) {
        const schema = Joi.object({
            post: Joi.string(),
            id: Joi.string().optional()
        });

        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(HttpStatus.CONFLICT).json({ msg: error.details });
        }

        const updatedPost = {
            post: req.body.post,
            created: new Date()
        }

        await Post.findOneAndUpdate({ _id: req.body.id }, updatedPost, {
            new: true, useFindAndModify: false
        }).then(post => {
            res.status(HttpStatus.OK)
                .json({ message: 'post updated successfully' });
        }).catch(err => {
            res.status(HttpStatus.NOT_FOUND)
                .json({ message: 'post upadted failure' });
        })
    },
    async deletePost(req, res) {
        const { id } = req.params;
        await Post.findByIdAndDelete(id, async (err, result) => {
            if (!result) {
                return res.status(HttpStatus.NOT_FOUND)
                    .json({ message: 'post deleted failure' });
            } else {
                await User.updateOne({
                    _id: req.user._id
                }, {
                    $pull: {
                        posts: {
                            postId: result._id
                        }
                    }
                }).then(data => {
                    res.status(HttpStatus.OK)
                        .json({ message: 'post deleted successfully' });
                }).catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({ message: 'error occured' });
                })

            }
        });



    }
}