const teacherService = require('../services/teacher.service');

exports.createTeacher = async (req, res) => {
  const teacher = await teacherService.createTeacher(req.body);
  res.status(201).json(teacher);
};

exports.getAllTeachers = async (req, res) => {
  const teachers = await teacherService.getAllTeachers();
  res.json(teachers);
};

exports.getTeacherById = async (req, res) => {
  const teacher = await teacherService.getTeacherById(req.params.id);
  if (teacher) res.json(teacher);
  else res.status(404).json({ message: 'Teacher not found' });
};

exports.updateTeacher = async (req, res) => {
  await teacherService.updateTeacher(req.params.id, req.body);
  res.json({ message: 'Teacher updated' });
};

exports.deleteTeacher = async (req, res) => {
  await teacherService.deleteTeacher(req.params.id);
  res.json({ message: 'Teacher deleted' });
};
const studentService = require('../services/student.service');

