const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const authenticateToken = require('../middleware/auth.middleware');


router.post('/',authenticateToken, teacherController.createTeacher);
router.get('/',authenticateToken, teacherController.getAllTeachers);
router.get('/:id',authenticateToken, teacherController.getTeacherById);
router.put('/:id',authenticateToken, teacherController.updateTeacher);
router.delete('/:id',authenticateToken, teacherController.deleteTeacher);

module.exports = router;
