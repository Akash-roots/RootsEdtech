const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const ClassStudent = sequelize.define('ClassStudent', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'class_students',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = ClassStudent;
