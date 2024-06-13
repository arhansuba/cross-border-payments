const express = require('express');
const router = express.Router();
const { register, login, getProfile } = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:userId', authenticate, getProfile);

module.exports = router;