const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Role = require('./Role');
const Student = require('./Student');
const Teacher = require('./Teacher');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'active'
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
  tableName: 'users'
});

// Many-to-many with roles
User.belongsToMany(Role, { through: 'user_roles', foreignKey: 'user_id' });
Role.belongsToMany(User, { through: 'user_roles', foreignKey: 'role_id' });
User.hasOne(Student, { foreignKey: 'user_id', as: 'studentProfile' });
User.hasOne(Teacher, { foreignKey: 'user_id', as: 'teacherProfile' });


module.exports = User;
