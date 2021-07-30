const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');

router.post('/', auth, multer, postCtrl.createPost);
router.put('/:id', auth, postCtrl.modifyPost);
router.delete('/:id', auth, postCtrl.deletePost);
router.get('/', auth, postCtrl.getAllPosts);

module.exports = router;