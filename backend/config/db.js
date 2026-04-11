const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`🔴 MongoDB Connection Error: ${error.message}`);
    // We don't exit(1) here so the server stays alive for debugging
  }
};

module.exports = connectDB;
