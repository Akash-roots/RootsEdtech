const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacher.controller');
const authenticateToken = require('../middleware/auth.middleware');


router.post('/', teacherController.createTeacher);
router.get('/', teacherController.getAllTeachers);
router.get('/:id', teacherController.getTeacherById);
router.put('/:id', teacherController.updateTeacher);
router.delete('/:id', teacherController.deleteTeacher);

module.exports = router;
