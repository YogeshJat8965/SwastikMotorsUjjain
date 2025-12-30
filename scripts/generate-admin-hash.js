// Run this script to generate a password hash for admin
// Usage: node scripts/generate-admin-hash.js

const bcrypt = require('bcryptjs');

const password = process.argv[2] || 'admin@123';

bcrypt.hash(password, 10).then(hash => {
  console.log('\n✅ Password hash generated successfully!\n');
  console.log('Add this to your .env.local file:\n');
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
  console.log(`Remove ADMIN_PASSWORD from .env.local after adding the hash.\n`);
}).catch(err => {
  console.error('Error generating hash:', err);
});
