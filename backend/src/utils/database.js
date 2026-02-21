const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Connect to MongoDB database
 */
const connectDatabase = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ps-blog';

    await mongoose.connect(MONGODB_URI);

    console.log('✅ Connected to MongoDB successfully');

    // Initialize default data
    await initializeDefaultData();

  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
    throw error; // Rethrow to let the function fail naturally for logs
  }
};

/**
 * Initialize default data (admin user and categories)
 */
const initializeDefaultData = async () => {
  try {
    const User = require('../models/User');
    const Category = require('../models/Category');

    // Create admin user if doesn't exist
    const adminExists = await User.findOne({ email: 'prasadshaswat9765@gmail.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('noonecanbeatme', 12);
      const admin = new User({
        name: 'Prasad Shaswat',
        email: 'prasadshaswat9765@gmail.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('✅ Admin user created successfully');
    }

    // Create default categories if none exist
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      const defaultCategories = [
        { name: 'Technology', description: 'Latest technology trends and news' },
        { name: 'Programming', description: 'Programming tutorials and tips' },
        { name: 'Web Development', description: 'Web development guides and resources' },
        { name: 'Lifestyle', description: 'Lifestyle and personal development' },
        { name: 'Tutorial', description: 'Step-by-step tutorials' }
      ];

      await Category.insertMany(defaultCategories);
      console.log('✅ Default categories created successfully');
    }

  } catch (error) {
    console.error('❌ Error initializing default data:', error);
  }
};

/**
 * Close database connection
 */
const closeDatabase = async () => {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
};

/**
 * Check if database is connected
 */
const isConnected = () => {
  return mongoose.connection.readyState === 1;
};

/**
 * Get database connection status
 */
const getConnectionStatus = () => {
  const states = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  return states[mongoose.connection.readyState];
};

module.exports = {
  connectDatabase,
  closeDatabase,
  isConnected,
  getConnectionStatus,
  initializeDefaultData
};