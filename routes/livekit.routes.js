const express = require('express');
const router = express.Router();
const livekitController = require('../controllers/livekit.controller');

router.get('/livekit-token',livekitController.generateToken);
router.get('/create-room', livekitController.createRoom)

module.exports = router;