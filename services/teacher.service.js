const Teacher = require('../models/Teacher');

exports.createTeacher = (data) => Teacher.create(data);
exports.getAllTeachers = () => Teacher.findAll();
exports.getTeacherById = (id) => Teacher.findByPk(id);
exports.updateTeacher = (id, data) => Teacher.update(data, { where: { userId: id } });
exports.deleteTeacher = (id) => Teacher.destroy({ where: { userId: id } });
