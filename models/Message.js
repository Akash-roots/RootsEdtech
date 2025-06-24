const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  room_id: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  sender_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  message_type: {
    type: DataTypes.STRING,
    defaultValue: 'text',
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  // Optional future field
  // is_read: {
  //   type: DataTypes.BOOLEAN,
  //   defaultValue: false,
  // },
}, {
  tableName: 'messages',
  timestamps: false,
});

Message.belongsTo(User, { foreignKey: 'sender_id', as: 'sender' });

module.exports = Message;
