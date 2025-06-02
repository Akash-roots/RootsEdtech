const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const authenticateToken = require('../middleware/auth.middleware');


router.post('/',authenticateToken, courseController.createCourse);
router.get('/',authenticateToken, courseController.getAllCourses);
router.get('/:id',authenticateToken, courseController.getCourseById);
router.put('/:id',authenticateToken, courseController.updateCourse);
router.delete('/:id',authenticateToken, courseController.deleteCourse);

module.exports = router;
