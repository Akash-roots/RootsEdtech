// scripts/seedRoles.js
const sequelize = require('../config/sequelize');
const Role = require('./Role');

async function seedRoles() {
  await sequelize.sync();

  const roles = ['student', 'teacher', 'admin'];

  for (const name of roles) {
    await Role.findOrCreate({ where: { name } });
  }

  console.log('✅ Roles seeded successfully!');
  process.exit();
}

seedRoles();
