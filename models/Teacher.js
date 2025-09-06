const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');
const User = require('./User');

const Teacher = sequelize.define('Teacher', {
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
  full_name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  qualifications: {
    type: DataTypes.STRING,
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Number of years of teaching experience'
  },
  dob: {
    type: DataTypes.DATE,
    allowNull: true,
    comment: 'Date of birth of the teacher'
  },
  gender: {
    type: DataTypes.STRING,   // <-- changed from ENUM
    allowNull: true,
    comment: 'Gender of the teacher'
  },
  // subject_expertise: {
  //   type: DataTypes.STRING,
  //   allowNull: true,
  //   comment: 'Primary subject or field of expertise'
  // },
  languages: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profile_picture: {
    type: DataTypes.STRING, // file path or URL
    allowNull: true
  }
}, {
  tableName: 'teachers',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

// Teacher.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = Teacher;
