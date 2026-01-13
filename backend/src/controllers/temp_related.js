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
        // 1. Same category
        // 2. Share tags
        // 3. Exclude current blog
        // 4. Must be published

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
                    // Calculate score: +2 for same category, +1 for each matching tag
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

module.exports = {
    getBlogs,
    getBlogBySlug,
    createBlog,
    updateBlog,
    deleteBlog,
    getAllBlogsAdmin,
    addComment,
    toggleLike,
    getRelatedBlogs
};
