#!/usr/bin/env node

/**
 * Generate secure secrets for production deployment
 * Run with: node generate-secrets.js
 */

import crypto from 'crypto';

console.log('\n🔐 RouteIQ Production Secrets Generator\n');
console.log('Copy these values to your Railway environment variables:\n');
console.log('─'.repeat(60));

// Generate JWT Secret (64 characters)
const jwtSecret = crypto.randomBytes(32).toString('hex');
console.log('\nJWT_SECRET=');
console.log(jwtSecret);

console.log('\n' + '─'.repeat(60));
console.log('\n✅ Secrets generated successfully!');
console.log('\n📋 Next steps:');
console.log('1. Copy the JWT_SECRET value above');
console.log('2. Go to Railway → Your Backend Service → Variables');
console.log('3. Add JWT_SECRET with the generated value');
console.log('4. Keep this value secure and never commit it to git!\n');
