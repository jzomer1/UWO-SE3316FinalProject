const express = require('express');
const router = express.Router();
const { getUserEmails } = require('../controllers/usersController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

// middleware
router.get('/emails', authenticateMiddleware, getUserEmails);

module.exports = router;