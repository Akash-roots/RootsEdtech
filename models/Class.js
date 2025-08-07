const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Class = sequelize.define('Class', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  type: DataTypes.STRING,
  title: DataTypes.STRING,
  datetime: DataTypes.DATE,
  duration: DataTypes.INTEGER,
  subject: DataTypes.STRING,
  pricing: DataTypes.STRING,
  max_participants: DataTypes.INTEGER,
  recurrence: DataTypes.STRING,
  room_id: DataTypes.STRING,
  room_password: DataTypes.STRING,
  status: {
    type: DataTypes.STRING,
    defaultValue: 'scheduled',
  },
  teacher_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'users', key: 'id' },
  },
}, {
  tableName: 'classes',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

Class.belongsTo(User, { foreignKey: 'teacher_id', as: 'teacher' });

module.exports = Class;
