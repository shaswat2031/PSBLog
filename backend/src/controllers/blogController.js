const Blog = require('../models/Blog');
const { formatResponse, generateSlug, paginate } = require('../utils/helpers');
const { deleteImage } = require('../utils/cloudinary');

/**
 * Get all published blogs with pagination
 * GET /api/blogs
 */
const getBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      sort = '-publishedAt'
    } = req.query;

    // Build filter
    let filter = { status: 'published' };

    if (req.query.debug) {
      console.log('Debug mode: Clearing formatted filter');
      filter = {};
    }

    if (category) {
      filter.category = category;
    }

    if (search) {
      filter.$text = { $search: search };
    }

    console.log('GetBlogs Filter:', JSON.stringify(filter));
    const count = await Blog.countDocuments(filter);
    console.log('GetBlogs Count found:', count);

    // Pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sort.startsWith('-') ? sort.substring(1) : sort]: sort.startsWith('-') ? -1 : 1 },
      populate: 'author'
    };

    const result = await paginate(Blog, filter, options);

    res.json(
      formatResponse(true, 'Blogs retrieved successfully', result.data, {
        pagination: result.pagination
      })
    );
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve blogs')
    );
  }
};

/**
 * Get single blog by slug
 * GET /api/blogs/:slug
 */
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    const blog = await Blog.findOne({
      slug,
      status: 'published'
    })
      .populate('author', 'name email');

    if (!blog) {
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // Increment view count
    blog.views += 1;
    await blog.save();

    res.json(
      formatResponse(true, 'Blog retrieved successfully', blog)
    );
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve blog')
    );
  }
};

/**
 * Create new blog (Admin only)
 * POST /api/blogs
 */
const createBlog = async (req, res) => {
  try {
    const { title, excerpt, content, category, tags, status = 'draft' } = req.body;

    // Validate required fields
    if (!title || !excerpt || !content || !category) {
      return res.status(400).json(
        formatResponse(false, 'Title, excerpt, content, and category are required')
      );
    }

    // Generate unique slug
    let slug = generateSlug(title);
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      slug = `${slug}-${Date.now()}`;
    }

    // Handle featured image upload
    let featuredImage = req.body.featuredImage
      ? { url: req.body.featuredImage, publicId: null, alt: title }
      : null;

    if (req.file) {
      featuredImage = {
        url: req.file.path,
        publicId: req.file.filename,
        alt: title
      };
    }

    // Create blog
    const blog = new Blog({
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      category: category.trim(),
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      author: req.user._id,
      status,
      featuredImage
    });

    await blog.save();
    await blog.populate('author', 'name email');

    res.status(201).json(
      formatResponse(true, 'Blog created successfully', blog)
    );
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to create blog')
    );
  }
};

/**
 * Update blog (Admin only)
 * PUT /api/blogs/:id
 */
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, tags, status } = req.body;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // Update fields
    if (title) {
      blog.title = title.trim();
      blog.slug = generateSlug(title);

      // Ensure slug uniqueness
      const existingBlog = await Blog.findOne({
        slug: blog.slug,
        _id: { $ne: id }
      });
      if (existingBlog) {
        blog.slug = `${blog.slug}-${Date.now()}`;
      }
    }

    if (excerpt) blog.excerpt = excerpt.trim();
    if (content) blog.content = content.trim();
    if (category) blog.category = category.trim();
    if (tags) blog.tags = tags.split(',').map(tag => tag.trim());
    if (status) blog.status = status;

    // Handle featured image upload
    if (req.file) {
      try {
        // Delete old image if exists
        if (blog.featuredImage?.publicId) {
          await deleteImage(blog.featuredImage.publicId);
        }

        // Use new image from Cloudinary (uploaded by middleware)
        blog.featuredImage = {
          url: req.file.path,
          publicId: req.file.filename,
          alt: blog.title
        };
      } catch (uploadError) {
        console.error('Image header update error:', uploadError);
        // Continue even if delete failed
      }
    } else if (req.body.featuredImage && (!blog.featuredImage || blog.featuredImage.url !== req.body.featuredImage)) {
      // If URL provided and it's different from existing (or existing is null)
      blog.featuredImage = {
        url: req.body.featuredImage,
        publicId: null,
        alt: blog.title
      };
    }

    await blog.save();
    await blog.populate('author', 'name email');

    res.json(
      formatResponse(true, 'Blog updated successfully', blog)
    );
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to update blog')
    );
  }
};

/**
 * Delete blog (Admin only)
 * DELETE /api/blogs/:id
 */
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // Delete featured image if exists
    if (blog.featuredImage?.publicId) {
      try {
        await deleteImage(blog.featuredImage.publicId);
      } catch (deleteError) {
        console.error('Image deletion error:', deleteError);
      }
    }

    await Blog.findByIdAndDelete(id);

    res.json(
      formatResponse(true, 'Blog deleted successfully')
    );
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to delete blog')
    );
  }
};

/**
 * Get all blogs for admin (including drafts)
 * GET /api/blogs/admin/all
 */
const getAllBlogsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search
    } = req.query;

    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    // Pagination options
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: 'author'
    };

    const result = await paginate(Blog, filter, options);

    res.json(
      formatResponse(true, 'Blogs retrieved successfully', result.data, {
        pagination: result.pagination
      })
    );
  } catch (error) {
    console.error('Get admin blogs error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve blogs')
    );
  }
};

/**
 * Add comment to blog
 * POST /api/blogs/:id/comments
 */
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, content } = req.body;

    // Validate input
    if (!name || !content) {
      return res.status(400).json(
        formatResponse(false, 'Name and content are required')
      );
    }

    if (content.length > 1000) {
      return res.status(400).json(
        formatResponse(false, 'Comment content must be less than 1000 characters')
      );
    }

    const blog = await Blog.findOne({
      _id: id,
      status: 'published'
    });

    if (!blog) {
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // Add comment
    blog.comments.push({
      author: {
        name: name.trim(),
        email: email ? email.toLowerCase().trim() : undefined
      },
      content: content.trim(),
      isApproved: true // Auto-approve for now
    });

    await blog.save();

    res.status(201).json(
      formatResponse(true, 'Comment added successfully', {
        comment: blog.comments[blog.comments.length - 1]
      })
    );
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to add comment')
    );
  }
};

/**
 * Like/Unlike blog
 * POST /api/blogs/:id/like
 */
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findOne({
      _id: id,
      status: 'published'
    });

    if (!blog) {
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // For simplicity, just increment likes
    // In a real app, you'd track which users liked what
    blog.likes += 1;
    await blog.save();

    res.json(
      formatResponse(true, 'Blog liked successfully', {
        likes: blog.likes
      })
    );
  } catch (error) {
    console.error('Toggle like error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to like blog')
    );
  }
};

/**
 * Get related blogs
 * GET /api/blogs/:slug/related
 */
const getRelatedBlogs = async (req, res) => {
  try {
    const { slug } = req.params;

    const currentBlog = await Blog.findOne({ slug });
    if (!currentBlog) {
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // Find related blogs
    const relatedBlogs = await Blog.aggregate([
      {
        $match: {
          _id: { $ne: currentBlog._id },
          status: 'published',
          $or: [
            { category: currentBlog.category },
            { tags: { $in: currentBlog.tags } }
          ]
        }
      },
      {
        $addFields: {
          relevanceScore: {
            $add: [
              { $cond: [{ $eq: ["$category", currentBlog.category] }, 2, 0] },
              { $size: { $setIntersection: ["$tags", currentBlog.tags] } }
            ]
          }
        }
      },
      { $sort: { relevanceScore: -1, publishedAt: -1 } },
      { $limit: 3 },
      {
        $project: {
          title: 1,
          slug: 1,
          featuredImage: 1,
          publishedAt: 1,
          category: 1,
          readTime: 1
        }
      }
    ]);

    res.json(
      formatResponse(true, 'Related blogs retrieved successfully', relatedBlogs)
    );
  } catch (error) {
    console.error('Get related blogs error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve related blogs')
    );
  }
};

/**
 * Get single blog by ID (Admin only)
 * GET /api/blogs/admin/:id
 */
const getBlogByIdAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`[Admin] Fetching blog by ID: ${id}`);

    // Check if ID is valid MongoDB ID
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      console.warn(`[Admin] Invalid ID format: ${id}`);
      return res.status(400).json(formatResponse(false, 'Invalid blog ID'));
    }

    const blog = await Blog.findById(id).populate('author', 'name email');

    if (!blog) {
      console.warn(`[Admin] Blog not found for ID: ${id}`);
      return res.status(404).json(
        formatResponse(false, 'Blog not found')
      );
    }

    // console.log(`[Admin] Blog found: ${blog.title} (${blog.status})`);
    res.json(
      formatResponse(true, 'Blog retrieved successfully', blog)
    );
  } catch (error) {
    console.error('Get admin blog error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve blog')
    );
  }
};

module.exports = {
  getBlogs,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogsAdmin,
  addComment,
  toggleLike,
  getRelatedBlogs,
  getBlogByIdAdmin
};