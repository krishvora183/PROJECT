const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const ServiceRequest = require('./models/ServiceRequest');
const Complaint = require('./models/Complaint');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await ServiceRequest.deleteMany();
    await Complaint.deleteMany();

    for (const user of users) {
      const newUser = new User(user);
      await newUser.save();
    }

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
