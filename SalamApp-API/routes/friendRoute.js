const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper')
const friendController = require('../controllers/friendController');
router.post('/follow-user', authHelper.verifyToken, friendController.followUser);
router.post('/unfollow-user', authHelper.verifyToken, friendController.unfollowUser);
router.post('/mark/:id', authHelper.verifyToken, friendController.markAsRead);
router.post('/mark-all', authHelper.verifyToken, friendController.markAllAsRead);
module.exports = router;