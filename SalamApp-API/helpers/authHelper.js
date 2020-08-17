const jwt = require('jsonwebtoken');
const config = require('../config/secret');
const HttpStatus = require('http-status-codes');
module.exports = {
    verifyToken(req, res, next) {
        if (!req.headers.authorization) {
            return res.status(HttpStatus.UNAUTHORIZED)
                .json({ message: 'No authorization header found' });
        }
        const token = req.cookies.auth || req.headers.authorization.split(' ')[1];
       
        if (!token) {
            return res.status(HttpStatus.FORBIDDEN)
                .json({ message: 'no token found' });
        }
        return jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
                if (err.expiredAt < new Date()) {
                    return res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .json({
                            message: 'token has expired , please login again',
                            token: null
                        });
                }
            }
            req.user = decoded.data;
            next();
        })
    }
}