const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/blogController');
const { auth, adminAuth } = require('../middleware/auth');
const { upload, handleMulterError } = require('../middleware/upload');

// Admin routes (Must be before public :slug routes to prevent collision)
router.get('/admin/all', adminAuth, getAllBlogsAdmin);
router.get('/admin/:id', adminAuth, getBlogByIdAdmin);
router.post('/', adminAuth, upload.single('featuredImage'), handleMulterError, createBlog);
router.put('/:id', adminAuth, upload.single('featuredImage'), handleMulterError, updateBlog);
router.delete('/:id', adminAuth, deleteBlog);

// Public routes
router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);
router.get('/:slug/related', getRelatedBlogs);
router.post('/:id/comments', addComment);
router.post('/:id/like', toggleLike);

module.exports = router;