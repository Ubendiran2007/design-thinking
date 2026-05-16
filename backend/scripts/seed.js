const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

const users = [
  {
    name: 'Water Dept Head',
    email: 'water@govt.com',
    password: 'password123',
    role: 'department',
    department: 'Water Department'
  },
  {
    name: 'Electricity Board',
    email: 'power@govt.com',
    password: 'password123',
    role: 'department',
    department: 'Electricity Board'
  },
  {
    name: 'Road Maintenance',
    email: 'road@govt.com',
    password: 'password123',
    role: 'department',
    department: 'Road Maintenance'
  },
  {
    name: 'Main Admin',
    email: 'admin@govt.com',
    password: 'adminpassword',
    role: 'admin'
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected for seeding...');

    // Clear existing dept users to avoid duplicates
    await User.deleteMany({ role: 'department' });
    
    // Check if admin exists, if not create
    const adminExists = await User.findOne({ email: 'admin@govt.com' });
    if (!adminExists) {
      await User.create(users.find(u => u.role === 'admin'));
    }

    // Create dept users
    for (const u of users.filter(u => u.role === 'department')) {
      await User.create(u);
    }

    console.log('Seeding Successful!');
    process.exit();
  } catch (error) {
    console.error('Seeding Failed:', error.message);
    process.exit(1);
  }
};

seedDB();
