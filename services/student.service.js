
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const Student = require('../models/Student');

exports.registerStudent = async (data) => {
    const {     email, password, roles = ['student'], status = 'active', ...studentData } = data;

    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({
        email,
        password: hashedPassword,
        status,
        last_login: null // optional default, can be omitted
    });
    const roleEntities = await Role.findAll({ where: { name: roles } });
    await user.setRoles(roleEntities);

    const student = await Student.create({ user_id: user.id, ...studentData });
    return student;
};

exports.createStudent = (data) => Student.create(data);
exports.getAllStudents = () => Student.findAll();
exports.getStudentById = (id) => Student.findByPk(id);
exports.updateStudent = (id, data) => Student.update(data, { where: { userId: id } });
exports.deleteStudent = (id) => Student.destroy({ where: { userId: id } });
