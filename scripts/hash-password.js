#!/usr/bin/env node

/**
 * Password Hashing Utility for Admin Authentication
 * 
 * This script generates bcrypt hashes for admin passwords.
 * Use this to create secure password hashes for the ADMIN_PASSWORD_HASH
 * environment variable.
 * 
 * Usage:
 *   node scripts/hash-password.js <password>
 * 
 * Example:
 *   node scripts/hash-password.js admin@123
 */

const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  if (!password) {
    console.error('❌ Error: Password is required');
    console.log('\nUsage: node scripts/hash-password.js <password>');
    console.log('Example: node scripts/hash-password.js admin@123');
    process.exit(1);
  }

  try {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('\n✅ Password hashed successfully!');
    console.log('\n📋 Copy this hash to your .env.local file:');
    console.log('─'.repeat(80));
    console.log(`ADMIN_PASSWORD_HASH=${hash}`);
    console.log('─'.repeat(80));
    console.log('\n💡 Tip: Keep this hash secure and never commit it to version control!\n');
    
    return hash;
  } catch (error) {
    console.error('❌ Error hashing password:', error.message);
    process.exit(1);
  }
}

// Get password from command line argument
const password = process.argv[2];

if (!password) {
  console.error('❌ Error: Password argument is required');
  console.log('\nUsage: node scripts/hash-password.js <password>');
  console.log('Example: node scripts/hash-password.js admin@123');
  process.exit(1);
}

hashPassword(password);
