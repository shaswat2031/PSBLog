require('dotenv').config();
const mongoose = require('mongoose');
const Blog = require('./src/models/Blog');
const User = require('./src/models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ps-blog';

const realBlogs = [
  {
    title: 'Mastering React 19: New Features and Best Practices',
    excerpt: 'Explore the groundbreaking features of React 19, including the new Compiler, Server Components enhancements, and improved hooks for cleaner code.',
    category: 'Technology',
    tags: ['react', 'javascript', 'frontend', 'web-development'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      alt: 'React Code on Screen'
    },
    content: `
      <h2>Introduction to React 19</h2>
      <p>React 19 represents a significant leap forward in the React ecosystem. With the introduction of the new <strong>React Compiler</strong> to automate memoization and enhancements to <strong>Server Components</strong>, building performant applications has never been easier.</p>
      
      <h3>The React Compiler</h3>
      <p>One of the most anticipated features is the React Compiler (formerly known as React Forget). It automatically optimizes your components by memoizing values and functions, effectively making <code>useMemo</code> and <code>useCallback</code> optional for performance tuning in many cases.</p>
      
      <pre><code class="language-javascript">
// Before: Manual optimization
const expensiveValue = useMemo(() => compute(a, b), [a, b]);

// React 19: Automatic optimization by the compiler
const expensiveValue = compute(a, b);
      </code></pre>

      <h3>Server Components Integration</h3>
      <p>Server Components (RSC) are now first-class citizens. They allow you to fetch data on the server and send minimal HTML to the client, reducing bundle sizes and improving First Contentful Paint (FCP).</p>

      <h3>New Hooks</h3>
      <p>React 19 also introduces <code>use()</code>, a new API to read values from promises or context. This simplifies async data handling within components.</p>
      
      <h3>Conclusion</h3>
      <p>Upgrade to React 19 to take advantage of these automatic optimizations and simplified architectures. The future of React is compiled and server-first!</p>
    `,
    status: 'published',
    views: 1250,
    likes: 340
  },
  {
    title: 'Building Scalable APIs with Node.js and Express',
    excerpt: 'A comprehensive guide to structuring your Node.js applications for scalability, security, and maintainability using Express frameworks.',
    category: 'Programming',
    tags: ['nodejs', 'express', 'backend', 'api'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      alt: 'Backend Code Structure'
    },
    content: `
      <h2>Why Node.js for Scalable APIs?</h2>
      <p>Node.js uses an event-driven, non-blocking I/O model, making it efficient for data-intensive real-time applications. When combined with <strong>Express</strong>, it provides a robust foundation for building RESTful APIs.</p>

      <h3>Layered Architecture</h3>
      <p>To ensure scalability, avoid putting everything in <code>server.js</code>. Adopt a layered architecture:</p>
      <ul>
        <li><strong>Controllers</strong>: Handle HTTP requests and responses.</li>
        <li><strong>Services</strong>: Contain business logic.</li>
        <li><strong>Data Access Layer (DAO)</strong>: Interact with the database.</li>
      </ul>

      <h3>Handling Asynchronous Errors</h3>
      <p>Always use <code>async/await</code> and improved error handling middleware. In Express 5 (implied in modern setups), promise rejections are handled more gracefully, but wrapping route handlers is still good practice.</p>

      <pre><code class="language-javascript">
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
      </code></pre>

      <h3>Security Best Practices</h3>
      <p>Don't forget security:</p>
      <ul>
        <li>Use <strong>Helmet</strong> for secure HTTP headers.</li>
        <li>Implement <strong>Rate Limiting</strong> to prevent abuse.</li>
        <li>Sanitize inputs against NoSQL injection.</li>
      </ul>
    `,
    status: 'published',
    views: 980,
    likes: 215
  },
  {
    title: 'Deep Dive into MongoDB Aggregation Pipelines',
    excerpt: 'Master the power of MongoDB Aggregations. Learn how to filter, group, and reshape your data directly within the database engine.',
    category: 'Tech',
    tags: ['mongodb', 'database', 'nosql', 'data-science'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      alt: 'Data Visualization'
    },
    content: `
      <h2>Unlocking MongoDB's Power</h2>
      <p>The Aggregation Framework is one of MongoDB's most powerful features, allowing you to process data records and return computed results. It's built as a pipeline of stages.</p>

      <h3>Common Stages</h3>
      <ul>
        <li><code>$match</code>: Filters the documents (like SQL WHERE).</li>
        <li><code>$group</code>: Groups documents by a specified identifier (like SQL GROUP BY).</li>
        <li><code>$project</code>: Reshapes each document in the stream (like SQL SELECT).</li>
      </ul>

      <h3>Real Object Example: Sales Report</h3>
      <p>Imagine generating a monthly sales report from thousands of transaction documents.</p>

      <pre><code class="language-javascript">
db.sales.aggregate([
  { $match: { status: "completed" } },
  { $group: { 
      _id: { $month: "$date" }, 
      totalRevenue: { $sum: "$amount" },
      averageOrder: { $avg: "$amount" }
  }},
  { $sort: { _id: 1 } }
]);
      </code></pre>

      <h3>Optimization Tips</h3>
      <p>Always place <code>$match</code> and <code>$sort</code> stages at the beginning of your pipeline to take advantage of indexes and reduce the dataset early.</p>
    `,
    status: 'published',
    views: 845,
    likes: 190
  },
  {
    title: 'Modern CSS: From Flexbox to Grid and Beyond',
    excerpt: 'Stop fighting with floats. Learn how to build complex, responsive layouts easily using modern CSS Grid and Flexbox techniques.',
    category: 'Web Development',
    tags: ['css', 'design', 'frontend', 'responsive'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80',
      alt: 'CSS Layout Design'
    },
    content: `
      <h2>The Evolution of CSS Layouts</h2>
      <p>Gone are the days of clearing floats and hacky table layouts. Modern CSS provides us with robust tools to create two-dimensional layouts with ease.</p>

      <h3>Flexbox vs. Grid</h3>
      <p><strong>Flexbox</strong> is one-dimensional (rows OR columns). It's perfect for aligning items within a container, like a navigation bar.</p>
      <p><strong>CSS Grid</strong> is two-dimensional (rows AND columns). It's best for defining the overall page layout.</p>

      <h3>A Simple Grid Layout</h3>
      <pre><code class="language-css">
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
      </code></pre>
      <p>This simple snippet creates a responsive card layout that automatically adjusts the number of columns based on screen width—no media queries required!</p>

      <h3>Subgrid</h3>
      <p>With the new <code>subgrid</code> feature, nested grids can align with the parent grid tracks, solving a long-standing issue in complex design systems.</p>
    `,
    status: 'published',
    views: 1560,
    likes: 420
  },
  {
    title: 'The Complete Guide to Next.js App Router',
    excerpt: 'Understand the paradigm shift in Next.js 13/14 with the App Router. Learn about Layouts, Server Components, and Streaming.',
    category: 'Programming',
    tags: ['nextjs', 'react', 'fullstack', 'framework'],
    featuredImage: {
      url: 'https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=764&q=80',
      alt: 'Next.js Concept'
    },
    content: `
      <h2>Moving to the App Router</h2>
      <p>The <code>app</code> directory in Next.js introduces a new file-system based router built on top of React Server Components.</p>

      <h3>Key Concepts</h3>
      <ul>
        <li><strong>Layouts.js</strong>: Share UI between routes while preserving state and avoiding re-renders.</li>
        <li><strong>Page.js</strong>: The unique UI for a route.</li>
        <li><strong>Loading.js</strong>: Create instant loading states with React Suspense.</li>
      </ul>

      <h3>Data Fetching</h3>
      <p>Say goodbye to <code>getStaticProps</code>. In the App Router, you can fetch data directly inside your Server Components using <code>async/await</code>.</p>

      <pre><code class="language-javascript">
async function getData() {
  const res = await fetch('https://api.example.com/data');
  return res.json();
}

export default async function Page() {
  const data = await getData();
  return <main>{/* Render data */}</main>;
}
      </code></pre>

      <h3>Streaming</h3>
      <p>Streaming allows you to progressively render parts of the UI and send them to the client, improving perceived load performance significantly.</p>
    `,
    status: 'published',
    views: 2100,
    likes: 560
  }
];

async function seedRealBlogs() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find the admin user
    const adminUser = await User.findOne({ email: 'prasadshaswat9765@gmail.com' });

    if (!adminUser) {
      console.error('❌ Admin user not found. Please run the admin setup script first.');
      process.exit(1);
    }

    console.log(`👤 Using Author: ${adminUser.name}`);

    // Clear existing blogs
    await Blog.deleteMany({});
    console.log('🗑️ Cleared existing blogs');

    for (const blogData of realBlogs) {
      // Check if title exists to avoid duplicates if run multiple times
      const exists = await Blog.findOne({ title: blogData.title });
      if (exists) {
        console.log(`⚠️ Blog already exists: "${blogData.title}"`);
        continue;
      }

      const blog = new Blog({
        ...blogData,
        author: adminUser._id,
        authorName: adminUser.name,
        publishedAt: new Date()
      });

      await blog.save();
      console.log(`✨ Created Blog: "${blog.title}"`);
    }

    console.log('✅ Successfully added real blog data!');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding blogs:', error);
    process.exit(1);
  }
}

seedRealBlogs();
