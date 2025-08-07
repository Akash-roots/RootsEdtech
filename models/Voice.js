const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Voice = sequelize.define('Voice', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  file_path: DataTypes.STRING,
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'voices',
  timestamps: false,
});

module.exports = Voice;
