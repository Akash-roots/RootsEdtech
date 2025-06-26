const express = require('express');
const router = express.Router();
const { getRecentChats ,getChatHistory} = require('../controllers/message.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.get('/recent-chats',authenticateToken, getRecentChats);
router.get('/history/:roomId', authenticateToken, getChatHistory);


module.exports = router;
