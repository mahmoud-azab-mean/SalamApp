const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper')
const photoController = require('../controllers/photoController');
router.post('/upload-photo', authHelper.verifyToken, photoController.uploadPhoto);
router.get('/set-default-photo/:photoVersion/:photoId', authHelper.verifyToken, photoController.setDefaultPhoto);
router.get('/delete-photo/:photoId', authHelper.verifyToken, photoController.deletePhoto);


module.exports = router;