const express = require('express');
const router = express.Router();
const { createClass, getMyClasses,addStudentToClass, getStudentsInClass ,getStudentClasses } = require('../controllers/class.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/create', authenticateToken, createClass);
router.get('/my-classes', authenticateToken, getMyClasses);
router.post('/:classId/add-student', authenticateToken, addStudentToClass);
router.get('/:classId/students', authenticateToken, getStudentsInClass);
router.get('/student', authenticateToken, getStudentClasses);
module.exports = router;
