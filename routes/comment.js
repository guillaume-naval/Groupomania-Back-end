const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');

router.post('/:postId/comment', auth, multer, commentCtrl.createComment);
router.get('/:postId/comment', auth, commentCtrl.getAllComments);
router.get('/:postId/comment/:commentId', auth, commentCtrl.getOneComment);
router.delete('/:postId/comment/:commentId', auth, commentCtrl.deleteComment);
module.exports = router;