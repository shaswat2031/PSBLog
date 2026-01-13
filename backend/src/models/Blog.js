const mongoose = require('mongoose');
const { generateSlug, calculateReadingTime } = require('../utils/helpers');

const commentSchema = new mongoose.Schema({
  id: {
    type: String,
    default: () => new mongoose.Types.ObjectId().toString()
  },
  author: {
    name: { type: String, required: true },
    email: { type: String, required: false },
    avatar: String
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  excerpt: {
    type: String,
    trim: true,
    maxlength: 500
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    default: 'Anonymous'
  },
  category: {
    type: String,
    trim: true,
    default: 'Uncategorized'
  },
  tags: [{
    type: String,
    trim: true
  }],
  featuredImage: {
    url: String,
    publicId: String,
    alt: String
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [commentSchema],
  readTime: {
    type: Number,
    default: 0
  },
  publishedAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Index already defined in schema field
blogSchema.index({ status: 1, publishedAt: -1 });

blogSchema.pre('save', function (next) {
  if (!this.slug && this.title) {
    this.slug = generateSlug(this.title);
  }

  if (this.content) {
    this.readTime = calculateReadingTime(this.content);
  }

  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  next();
});

blogSchema.methods.addComment = function (commentData) {
  const newComment = {
    author: {
      name: commentData.name,
      email: commentData.email || null
    },
    content: commentData.content,
    createdAt: new Date()
  };

  this.comments.push(newComment);
  return newComment;
};

blogSchema.statics.findBySlug = function (slug) {
  return this.findOne({ slug });
};

blogSchema.statics.findPublished = function (query = {}) {
  return this.find({
    ...query,
    status: 'published'
  }).sort({ publishedAt: -1 });
};

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;
