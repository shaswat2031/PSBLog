require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');
const Blog = require('./src/models/Blog');
const Category = require('./src/models/Category');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ps-blog';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Blog.deleteMany({});
    await Category.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'noonecanbeatme', 12);
    const adminUser = new User({
      name: process.env.ADMIN_NAME || 'Prasad Shaswat',
      email: process.env.ADMIN_EMAIL || 'prasadshaswat9765@gmail.com',
      password: adminPassword,
      role: 'admin'
    });
    await adminUser.save();
    console.log('👤 Admin user created');

    // Create categories
    const categories = [
      { name: 'Technology', description: 'Latest technology trends and news' },
      { name: 'Programming', description: 'Programming tutorials and tips' },
      { name: 'Web Development', description: 'Web development guides and resources' },
      { name: 'Lifestyle', description: 'Lifestyle and personal development' },
      { name: 'Tutorial', description: 'Step-by-step tutorials' }
    ];

    // Create categories individually to trigger pre-save middleware
    for (const categoryData of categories) {
      const category = new Category(categoryData);
      await category.save();
    }
    console.log('📂 Categories created');

    // Create sample blog posts
    const sampleBlogs = [
      {
        title: 'Welcome to PS Blog',
        content: 'This is a sample blog post to demonstrate the MongoDB integration. The blog now uses MongoDB for data storage instead of JSON files.',
        excerpt: 'A sample blog post showcasing MongoDB integration',
        category: 'Technology',
        tags: ['mongodb', 'nodejs', 'blog'],
        status: 'published',
        author: adminUser._id,
        authorName: adminUser.name
      },
      {
        title: 'Getting Started with MongoDB',
        content: 'MongoDB is a powerful NoSQL database that provides flexibility and scalability for modern applications. In this post, we explore the basics of MongoDB integration.',
        excerpt: 'Learn the basics of MongoDB integration in Node.js applications',
        category: 'Programming',
        tags: ['mongodb', 'database', 'nosql'],
        status: 'published',
        author: adminUser._id,
        authorName: adminUser.name
      }
    ];

    // Create blogs individually to trigger pre-save middleware
    for (const blogData of sampleBlogs) {
      const blog = new Blog(blogData);
      await blog.save();
    }
    console.log('📝 Sample blogs created');

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
}

seedDatabase();