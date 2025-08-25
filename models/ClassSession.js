// models/ClassSession.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const Class = require('./Class');

const ClassSession = sequelize.define('ClassSession', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: { model: 'classes', key: 'id' },
    onDelete: 'CASCADE',
  },

  // Actual occurrence window (UTC)
  start_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_time: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  status: {
    type: DataTypes.STRING, // scheduled | cancelled | completed
    allowNull: false,
    defaultValue: 'scheduled',
  },

  // Meeting/room details per occurrence
  room_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  room_password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  join_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'class_sessions',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    { fields: ['class_id'] },
    { fields: ['start_time'] },
    { fields: ['class_id', 'start_time'] },
  ],
});

// Associations
Class.hasMany(ClassSession, {
  foreignKey: 'class_id',
  as: 'sessions',
  onDelete: 'CASCADE',
});
ClassSession.belongsTo(Class, { foreignKey: 'class_id', as: 'class' });

module.exports = ClassSession;
