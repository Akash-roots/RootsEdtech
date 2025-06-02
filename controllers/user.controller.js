const userService = require('../services/user.service');

exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

exports.getUserById = async (req, res) => {
  const user = await userService.getUserById(req.params.id);
  if (user) res.json(user);
  else res.status(404).json({ message: 'User not found' });
};

exports.updateUser = async (req, res) => {
  try {
    console.log('Update payload:', req.body);
    await userService.updateUser(req.params.id, req.body);
    res.json({ message: 'User updated' });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ error: err.message });
  }};

exports.deleteUser = async (req, res) => {
  await userService.deleteUser(req.params.id);
  res.json({ message: 'User deleted' });
};
