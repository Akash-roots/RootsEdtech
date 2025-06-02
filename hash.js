const bcrypt = require('bcryptjs');
const password = 'Akash83416'; // your plain password
const hash = bcrypt.hashSync(password, 10);

console.log('Hashed password:', hash);
