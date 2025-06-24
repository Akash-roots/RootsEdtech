// routes/rooms.js
const express = require('express');
const router = express.Router();
const { getOrCreateRoom } = require('../controllers/room.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/chat-room',authenticateToken, getOrCreateRoom);

module.exports = router;
