const express = require('express');
const router = express.Router();
const livekitController = require('../controllers/livekit.controller');

router.get('/livekit-token',livekitController.generateToken);

module.exports = router;