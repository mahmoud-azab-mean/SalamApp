const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper')
const userController = require('../controllers/userController');
router.get('/users', authHelper.verifyToken, userController.getAllUsers);
router.get('/user/:id', authHelper.verifyToken, userController.getUser);
router.post('/change-password', authHelper.verifyToken, userController.changePassword);
module.exports = router;