const express = require('express');
const router = express.Router();
const { createClass, getMyClasses } = require('../controllers/class.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/create', authenticateToken, createClass);
router.get('/my-classes', authenticateToken, getMyClasses);

module.exports = router;
