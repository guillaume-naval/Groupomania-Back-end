const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const reactCtrl = require('../controllers/react');
const auth = require('../middleware/auth');

router.post('/:postId/react', auth, multer, reactCtrl.createReact);
router.get('/:postId/react', auth, reactCtrl.getAllReacts);
router.get('/:postId/react/:reactId', auth, reactCtrl.getOneReact);
router.delete('/:postId/react/:reactId', auth, reactCtrl.deleteReact);


module.exports = router;