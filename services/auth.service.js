const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');
const Student = require('../models/Student');
const Teacher = require('../models/Teacher');

exports.registeration = async (data) => {
  const {
    email,
    password,
    roles,
    ...profileData
  } = data;

  // 1. Create user
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    status : 'active',
    last_login: null
  });

  // 2. Assign role
  const roleEntities = await Role.findAll({ where: { name: roles } });
  await user.setRoles(roleEntities);

  // 3. Create linked model based on role
  if (roles.includes('student')) {
    await Student.create({ user_id: user.id, ...profileData });
  } else if (roles.includes('teacher')) {
    await Teacher.create({ user_id: user.id, ...profileData });
  }

  return { message: 'User profile created successfully' };
};