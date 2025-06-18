const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { SECRET_KEY } = require('../config/config');
const User = require('../models/User');
const Role = require('../models/Role');
const authService =  require('../services/auth.service');

exports.login = async (req, res) => {
  console.log("req.body",req.body);
  
  const { email, password } = req.body;

  try {
    const user = await User.findOne({
      where: { email },
      include: Role
    });

    if (!user) {
      return res.status(401).send('Invalid username or password');
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Invalid username or password');
    }

    const roles = user.Roles.map(role => role.name);

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        roles
      },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token,"role":roles,'user_id': user.id});
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
};
exports.registeration = async (req, res) => {
  try {
    const student = await authService.registeration(req.body);
    res.status(201).json({ message: 'Student registered successfully', student });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: err.message });
  }
};
