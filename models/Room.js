const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user1_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  user2_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'rooms',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Room;
