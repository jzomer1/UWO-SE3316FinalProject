const express = require('express');
const router = express.Router();
const { test, userSignup, userLogin, getProfile } = require('../controllers/authController')

// middleware

router.get('/test', test)
router.post('/signup', userSignup)
router.post('/login', userLogin)
router.get('/profile', getProfile)

module.exports = router