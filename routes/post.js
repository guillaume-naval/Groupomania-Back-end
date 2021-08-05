const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

router.post('/create', auth, multer, postCtrl.createPost);
router.put('/:postId', auth, multer, postCtrl.modifyPost);
router.delete('/:postId', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPosts);
router.get('/:postId', auth, postCtrl.getOnePost);

module.exports = router;