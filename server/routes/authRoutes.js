const express = require('express');
const router = express.Router();
const { test, userSignup, userLogin } = require('../controllers/authController')

// middleware

router.get('/test', test)
router.post('/signup', userSignup)
router.post('/login', userLogin)

module.exports = router