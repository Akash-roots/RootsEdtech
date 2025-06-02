const Course = require('../models/Course');

exports.createCourse = (data) => Course.create(data);
exports.getAllCourses = () => Course.findAll();
exports.getCourseById = (id) => Course.findByPk(id);
exports.updateCourse = (id, data) => Course.update(data, { where: { id } });
exports.deleteCourse = (id) => Course.destroy({ where: { id } });
