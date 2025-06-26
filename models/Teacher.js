const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Teacher = sequelize.define('Teacher', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    onDelete: 'CASCADE'
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.STRING,
    allowNull: true
  },
  languages: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING, // can be a file path or URL
    allowNull: true
  }
}, {
  tableName: 'teachers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Teacher.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Teacher;
