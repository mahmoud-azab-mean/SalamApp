const express = require('express');
const router = express.Router();
const authHelper = require('../helpers/authHelper')
const postController = require('../controllers/postController');
router.post('/post/add-post', authHelper.verifyToken, postController.addPost);
router.post('/post/add-like', authHelper.verifyToken, postController.addLike);
router.post('/post/add-comment', authHelper.verifyToken, postController.addComment);
router.get('/posts', authHelper.verifyToken, postController.getPosts);
router.get('/post/:id', authHelper.verifyToken, postController.getPost);
router.put('/post/edit-post', authHelper.verifyToken, postController.editPost);
router.delete('/post/delete-post/:id', authHelper.verifyToken, postController.deletePost);

module.exports = router;