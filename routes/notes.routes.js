const express = require('express');
const router = express.Router();
const notesController = require('../controllers/notes.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/',authenticateToken, notesController.logNote);
router.get('/:room',authenticateToken, notesController.getNotes);

module.exports = router;
