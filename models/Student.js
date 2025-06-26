const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/sequelize');

class Student extends Model {}

Student.init({
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
  full_name: DataTypes.STRING,
  dob: DataTypes.DATEONLY,
  gender: DataTypes.STRING,
  language_preference: DataTypes.STRING,
  address: DataTypes.TEXT,
  guardian_name: DataTypes.STRING,
  guardian_contact: DataTypes.STRING
}, {
  sequelize,
  modelName: 'Student',
  tableName: 'students',
  timestamps: true
});

// Student.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Student;