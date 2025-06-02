const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Role = require('../models/Role');

exports.createUser = async ({ email, password, status = 'active', roles }) => {
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create user with updated schema fields
  const user = await User.create({
    email,
    password: hashedPassword,
    status,
    last_login: null
  });

  // Set roles if provided
  if (roles && roles.length > 0) {
    const roleEntities = await Role.findAll({ where: { name: roles } });
    await user.setRoles(roleEntities);
  }

  return user;
};

exports.getAllUsers = () => User.findAll({ include: Role });

exports.getUserById = (id) => User.findByPk(id, { include: Role });

exports.updateUser = async (id, data) => {
  const { roles, ...userData } = data;

  // Hash new password if present
  if (userData.password) {
    userData.password = bcrypt.hashSync(userData.password, 10);
  }

  await User.update(userData, { where: { id } });

  // Update roles if included
  if (roles && roles.length > 0) {
    const user = await User.findByPk(id);
    const roleEntities = await Role.findAll({ where: { name: roles } });
    await user.setRoles(roleEntities);
  }

  return { message: 'User updated successfully' };
};

exports.deleteUser = (id) => User.destroy({ where: { id } });
