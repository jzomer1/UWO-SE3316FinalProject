const express = require('express');
const router = express.Router();
const { test, userSignup, userLogin, getProfile, changePassword } = require('../controllers/authController')
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

// middleware
router.get('/test', test);
router.post('/signup', userSignup);
router.post('/login', userLogin);
router.get('/profile', authenticateMiddleware, getProfile);
router.post('/change-password', authenticateMiddleware, changePassword);

module.exports = router
