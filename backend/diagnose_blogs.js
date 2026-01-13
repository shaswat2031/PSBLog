const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const Blog = require('./src/models/Blog');

const diagnose = async () => {
    try {
        console.log('Connecting to:', process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected.');

        console.log('Listing all blogs (raw):');
        const blogs = await Blog.find({});
        console.log(`Found ${blogs.length} blogs.`);

        blogs.forEach(b => {
            console.log(`ID: ${b._id}`);
            console.log(`  Title: ${b.title}`);
            console.log(`  Status: '${b.status}' (Type: ${typeof b.status})`);
            console.log(`  PublishedAt: ${b.publishedAt}`);
            console.log(`  Category: '${b.category}'`);
            console.log('---');
        });

        const published = await Blog.find({ status: 'published' });
        console.log(`\nQuery { status: 'published' } found: ${published.length} docs.`);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected.');
    }
};

diagnose();
