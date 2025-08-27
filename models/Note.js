const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize'); // your sequelize instance

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  room_id: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  identity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  message: {
    type: DataTypes.TEXT, // JSON string from quill
    allowNull: false,
  },
}, {
  tableName: 'notes',
  timestamps: true, // createdAt, updatedAt
});

module.exports = Note;
