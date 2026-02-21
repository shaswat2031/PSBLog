const Blog = require('../models/Blog');
const Subscriber = require('../models/Subscriber');
const { formatResponse } = require('../utils/helpers');

/**
 * Get dashboard statistics
 * GET /api/stats/dashboard
 */
const getDashboardStats = async (req, res) => {
    try {
        const [
            totalBlogs,
            publishedBlogs,
            draftBlogs,
            totalSubscribers,
            totalViews,
            totalLikes
        ] = await Promise.all([
            Blog.countDocuments(),
            Blog.countDocuments({ status: 'published' }),
            Blog.countDocuments({ status: 'draft' }),
            Subscriber.countDocuments({ isConfirmed: true }),
            Blog.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
            Blog.aggregate([{ $group: { _id: null, total: { $sum: '$likes' } } }])
        ]);

        const stats = {
            blogs: {
                total: totalBlogs,
                published: publishedBlogs,
                draft: draftBlogs
            },
            subscribers: {
                total: totalSubscribers
            },
            engagement: {
                views: totalViews[0]?.total || 0,
                likes: totalLikes[0]?.total || 0
            }
        };

        res.json(formatResponse(true, 'Dashboard stats retrieved successfully', stats));
    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json(formatResponse(false, 'Failed to retrieve stats'));
    }
};

/**
 * Get specific blog statistics
 * GET /api/stats/blog/:id
 */
const getBlogStats = async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).select('views likes comments');

        if (!blog) {
            return res.status(404).json(formatResponse(false, 'Blog not found'));
        }

        const stats = {
            views: blog.views,
            likes: blog.likes,
            comments: blog.comments.length
        };

        res.json(formatResponse(true, 'Blog stats retrieved successfully', stats));
    } catch (error) {
        console.error('Get blog stats error:', error);
        res.status(500).json(formatResponse(false, 'Failed to retrieve blog stats'));
    }
};

module.exports = {
    getDashboardStats,
    getBlogStats
};
