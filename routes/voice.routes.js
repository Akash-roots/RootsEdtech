const express = require('express');
const router = express.Router();
const voiceController = require('../controllers/voice.controller');

router.get('/', voiceController.getVoices);
router.post('/', voiceController.createVoice);

module.exports = router;
