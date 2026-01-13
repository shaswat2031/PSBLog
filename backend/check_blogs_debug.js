const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Blog = require('./src/models/Blog');

const checkBlogs = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const totalBlogs = await Blog.countDocuments();
        const publishedBlogs = await Blog.countDocuments({ status: 'published' });
        const draftBlogs = await Blog.countDocuments({ status: 'draft' });

        console.log(`Total Blogs: ${totalBlogs}`);
        console.log(`Published Blogs: ${publishedBlogs}`);
        console.log(`Draft Blogs: ${draftBlogs}`);

        if (totalBlogs > 0) {
            const blogs = await Blog.find({}, 'title status category publishedAt slug').limit(10).sort({ createdAt: -1 });
            console.log('\nLatest 10 Blogs:');
            blogs.forEach(blog => {
                console.log(`- [${blog.status}] ${blog.title} (Category: ${blog.category}, Slug: ${blog.slug})`);
            });
        }

    } catch (error) {
        console.error('Error checking blogs:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkBlogs();
