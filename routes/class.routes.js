const express = require('express');
const router = express.Router();
const {
  createClass,
  getMyClasses,
  addStudentToClass,
  getStudentsInClass,
  getStudentClasses,
  getClassById,
  startClass,
  endClass,
  getUpcomingSessions,
} = require('../controllers/class.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/create', authenticateToken, createClass);
router.get('/my-sessions', authenticateToken, getUpcomingSessions);
router.get('/my-classes', authenticateToken, getMyClasses);
router.post('/:classId/add-student', authenticateToken, addStudentToClass);
router.get('/:classId/students', authenticateToken, getStudentsInClass);

// Remove student from class
const { removeStudentFromClass } = require('../controllers/class.controller');
router.post('/:classId/remove-student', authenticateToken, removeStudentFromClass);

router.post('/:classId/start', authenticateToken, startClass);
router.post('/:classId/end', authenticateToken, endClass);
router.get('/student', authenticateToken, getStudentClasses);
router.get('/:classId', authenticateToken, getClassById);

module.exports = router;
