/**
 * One-time admin creation script
 * Run with: node createAdmin.js
 * Safe to run — will not delete any existing data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const User = require('./models/User');

dotenv.config();
connectDB();

const createAdmin = async () => {
  try {
    const adminEmail = 'admin@electricalstore.com';
    const adminPassword = 'Admin@1234';

    // Check if admin already exists
    const existing = await User.findOne({ email: adminEmail });
    if (existing) {
      console.log('✅ Admin already exists in database:');
      console.log(`   Email : ${adminEmail}`);
      console.log(`   Role  : ${existing.role}`);
      process.exit(0);
    }

    // Create admin user (password is hashed automatically by User model pre-save hook)
    const admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully!');
    console.log('───────────────────────────────────');
    console.log(`   Name  : ${admin.name}`);
    console.log(`   Email : ${adminEmail}`);
    console.log(`   Pass  : ${adminPassword}`);
    console.log(`   Role  : ${admin.role}`);
    console.log('───────────────────────────────────');
    console.log('Use these credentials to log in at /admin/login');
    process.exit(0);
  } catch (error) {
    console.error(`❌ Error creating admin: ${error.message}`);
    process.exit(1);
  }
};

createAdmin();
