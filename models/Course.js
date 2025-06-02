// models/Course.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Teacher = require('./Teacher');
const Category = require('./Category');

const Course = sequelize.define('Course', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Teacher,
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Category,
      key: 'id'
    },
    onDelete: 'SET NULL'
  }
}, {
  tableName: 'courses',
  timestamps: true
});

// Associations
Course.belongsTo(Teacher, { foreignKey: 'teacher_id' });
Course.belongsTo(Category, { foreignKey: 'category_id' });

module.exports = Course;
