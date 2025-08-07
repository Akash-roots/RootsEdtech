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
} = require('../controllers/class.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/create', authenticateToken, createClass);
router.get('/my-classes', authenticateToken, getMyClasses);
router.post('/:classId/add-student', authenticateToken, addStudentToClass);
router.get('/:classId/students', authenticateToken, getStudentsInClass);
router.post('/:classId/start', authenticateToken, startClass);
router.post('/:classId/end', authenticateToken, endClass);
router.get('/student', authenticateToken, getStudentClasses);
router.get('/:classId', authenticateToken, getClassById);
module.exports = router;
