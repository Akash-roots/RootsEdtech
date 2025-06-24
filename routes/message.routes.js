const express = require('express');
const router = express.Router();
const { getRecentChats } = require('../controllers/message.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.get('/recent-chats',authenticateToken, getRecentChats);

module.exports = router;
