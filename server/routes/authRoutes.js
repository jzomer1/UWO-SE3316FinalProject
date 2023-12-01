const express = require('express');
const router = express.Router();
const { test } = require('../controllers/authController')

// middleware

router.get('/test', test)

module.exports = router