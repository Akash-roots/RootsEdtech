const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    },
    onDelete: 'CASCADE'
  },
  full_name: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  gender: DataTypes.STRING,
  language_preference: DataTypes.STRING,
  address: DataTypes.TEXT,
  guardian_name: DataTypes.STRING,
  guardian_contact: DataTypes.STRING
}, {
  tableName: 'students',
  timestamps: true
});

Student.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Student;