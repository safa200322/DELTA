const bcrypt = require('bcryptjs');

const password = 'backend';  // Change this to your admin password

bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Hashed Password:', hash);
});