const courseService = require('../services/course.service');

exports.createCourse = async (req, res) => {
  const course = await courseService.createCourse(req.body);
  res.status(201).json(course);
};

exports.getAllCourses = async (req, res) => {
  const courses = await courseService.getAllCourses();
  res.json(courses);
};

exports.getCourseById = async (req, res) => {
  const course = await courseService.getCourseById(req.params.id);
  if (course) res.json(course);
  else res.status(404).json({ message: 'Course not found' });
};

exports.updateCourse = async (req, res) => {
  await courseService.updateCourse(req.params.id, req.body);
  res.json({ message: 'Course updated' });
};

exports.deleteCourse = async (req, res) => {
  await courseService.deleteCourse(req.params.id);
  res.json({ message: 'Course deleted' });
};