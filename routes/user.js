const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config')
const auth = require('../middleware/auth');
const userCtrl = require('../controllers/user');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/:id', userCtrl.userProfile);
router.put('/:id', auth,multer, userCtrl.modifyProfile);
router.delete('/:id', auth, userCtrl.deleteProfile)

module.exports = router;