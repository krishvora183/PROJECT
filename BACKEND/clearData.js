const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const ServiceRequest = require('./models/ServiceRequest');
const Complaint = require('./models/Complaint');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const destroyData = async () => {
  try {
    // Wipe all transactional and product data
    await Order.deleteMany();
    await Product.deleteMany();
    await ServiceRequest.deleteMany();
    await Complaint.deleteMany();
    
    // Delete all users EXCEPT the admin. 
    // We must keep the admin account so you can log in and add the very first products!
    await User.deleteMany({ role: { $ne: 'admin' } });

    console.log('All test and example data has been destroyed successfully.');
    console.log('Only the Admin User remains.');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

destroyData();
