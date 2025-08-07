const studentService = require('../services/student.service');

exports.createStudent = async (req, res) => {
  const student = await studentService.createStudent(req.body);
  res.status(201).json(student);
};

exports.getAllStudents = async (req, res) => {
  const students = await studentService.getAllStudents();
  res.json(students);
};

exports.getStudentById = async (req, res) => {
  const student = await studentService.getStudentById(req.params.id);
  if (student) res.json(student);
  else res.status(404).json({ message: 'Student not found' });
};

exports.getStudentByUserId = async (req, res) => {
  const student = await studentService.getStudentByUserId(req.params.userId);
  if (student) res.json(student);
  else res.status(404).json({ message: 'Student not found' });
};

exports.updateStudent = async (req, res) => {
  await studentService.updateStudent(req.params.id, req.body);
  res.json({ message: 'Student updated' });
};

exports.deleteStudent = async (req, res) => {
  await studentService.deleteStudent(req.params.id);
  res.json({ message: 'Student deleted' });
};
