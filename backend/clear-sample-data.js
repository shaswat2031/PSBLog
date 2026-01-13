require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./src/models/Blog');
const Category = require('./src/models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ps-blog';

async function clearSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear only blogs and categories (keep admin user)
    await Blog.deleteMany({});
    await Category.deleteMany({});
    
    console.log('🗑️ Removed all sample blogs and categories');
    console.log('✅ Database cleaned! Admin user is still there.');
    console.log('');
    console.log('You can now:');
    console.log('1. Login with: prasadshaswat9265@gmail.com / noonecanbeatme');
    console.log('2. Create your own blog posts');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

clearSampleData();