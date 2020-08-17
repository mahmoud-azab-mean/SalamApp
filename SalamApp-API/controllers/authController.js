const Joi = require('@hapi/joi');
const HttpStatus = require('http-status-codes');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const Helper = require('../helpers/helper');
const config = require('../config/secret');
module.exports = {
    async createUser(req, res) {
        const schema = Joi.object({
            username: Joi.string().regex(/^[a-zA-Z](.*[a-zA-Z0-9])?$/).min(2).max(10).required().messages(
                {
                    'string.pattern.base': 'Username should be a text ',
                    'string.min': 'Username less than 2 letters',
                    'string.max': 'Username more than 10 letters'
                }),
            email: Joi.string().email().required(),
            password: Joi.string().min(5).required()
        });
        const { error, value } = schema.validate(req.body);
        if (error) {
            return res.status(HttpStatus.CONFLICT).json({ msg: error.details });
        }
        const userName = await User.findOne({
            username: Helper.capitalize(value.username)
        });
        if (userName) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'User name already exist'
            });
        }

        const userEmail = await User.findOne({
            email: value.email.toLowerCase()
        });
        if (userEmail) {
            return res.status(HttpStatus.CONFLICT).json({
                message: 'Email already exist'
            });
        }
        return bcrypt.hash(value.password, 10, (err, hash) => {
            if (err) {
                return res.status(HttpStatus.BAD_REQUEST)
                    .json({ message: 'error occured while hashing password' });
            }
            const newUser = {
                username: Helper.capitalize(value.username),
                email: value.email.toLowerCase(),
                password: hash
            }
            User.create(newUser)
                .then(user => {
                    const token = jwt.sign({ data: user }, config.secret, { expiresIn: '10h' });
                    res.cookie('auth', token);
                    res.status(HttpStatus.CREATED)
                        .json({ message: 'user created successfully', user, token });
                })
                .catch(err => {
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({ message: 'error occured' })
                });
        });
    },
    async loginUser(req, res) {
        if (!req.body.username || !req.body.password) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: 'no empty fields allowed'
            });
        }
        await User.findOne({ username: Helper.capitalize(req.body.username) })
            .then(user => {
                if (!user) {
                    return res.status(HttpStatus.NOT_FOUND).json({
                        message: 'username not found'
                    });
                }
                return bcrypt.compare(req.body.password, user.password).then(result => {
                    if (!result) {
                        return res.status(HttpStatus.NOT_ACCEPTABLE).json({
                            message: 'password is incorrect'
                        });
                    }
                    const token = jwt.sign({ data: user }, config.secret,
                        { expiresIn: '10h' });
                    res.cookie('auth', token);
                    res.status(HttpStatus.OK)
                        .json({ message: 'login successful', user, token });
                })
            })
            .catch(err => {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    message: 'error occured'
                });
            })
    }
}