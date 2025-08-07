const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload.middleware');
const ivcController = require('../controllers/ivc.controller');

router.post('/', upload.array('files', 5), ivcController.instantClone);

module.exports = router;
