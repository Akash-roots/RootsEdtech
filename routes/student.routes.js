const express = require('express');
const router = express.Router();
const studentController = require('../controllers/student.controller');
const authenticateToken = require('../middleware/auth.middleware');

router.post('/',authenticateToken, studentController.createStudent);
router.get('/',authenticateToken, studentController.getAllStudents);
router.get('/:id',authenticateToken, studentController.getStudentById);
router.put('/:id',authenticateToken, studentController.updateStudent);
router.delete('/:id',authenticateToken, studentController.deleteStudent);


module.exports = router;
