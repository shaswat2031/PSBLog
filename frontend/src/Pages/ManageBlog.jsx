import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { blogAPI } from '../services/blogService'

const ManageBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalViews: 0
  });

  const containerRef = useRef(null);

  // Fetch blogs from backend
  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAllBlogsAdmin();
      if (response.success) {
        setBlogs(response.data);
        calculateStats(response.data);
        setError('');
      } else {
        setError('Failed to load blogs');
      }
    } catch {
      setError('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load blogs on mount
  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  // Calculate dashboard stats
  const calculateStats = (blogsData) => {
    const totalPosts = blogsData.length;
    const publishedPosts = blogsData.filter(blog => blog.status === 'published').length;
    const draftPosts = blogsData.filter(blog => blog.status === 'draft').length;
    const totalViews = blogsData.reduce((sum, blog) => sum + (blog.views || 0), 0);

    setStats({
      totalPosts,
      publishedPosts,
      draftPosts,
      totalViews
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      setBlogs(blogs.filter(blog => blog.id !== id));
      // Call API to delete would go here
      blogAPI.deleteBlog(id).then(res => {
        if (!res.success) alert("Failed to delete");
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'draft': return 'bg-amber-100 text-amber-700 border-amber-200';
      default: return 'bg-stone-100 text-stone-700 border-stone-200';
    }
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-50/50 px-6 pb-12 pt-32 md:px-12 md:pb-12 md:pt-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="header-content flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-3 tracking-tight">
              Manage Blog Posts
            </h1>
            <p className="text-lg text-stone-500 font-light">
              Create, edit, and manage your blog content
            </p>
          </div>
          <Link
            to="/admin/write"
            className="mt-6 sm:mt-0 px-8 py-3 bg-stone-900 text-white rounded-full hover:bg-stone-800 transition-all font-medium flex items-center space-x-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <span>New Post</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Posts */}
          <div className="stats-card bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-teal-50 transition-colors">
                <svg className="w-6 h-6 text-stone-600 group-hover:text-teal-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Total</span>
            </div>
            <div>
              <p className="text-4xl font-bold text-stone-800 mb-1">{stats.totalPosts}</p>
              <p className="text-stone-500 text-sm font-medium">Blog Posts</p>
            </div>
          </div>

          {/* Published */}
          <div className="stats-card bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-emerald-50 transition-colors">
                <svg className="w-6 h-6 text-stone-600 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Live</span>
            </div>
            <div>
              <p className="text-4xl font-bold text-stone-800 mb-1">{stats.publishedPosts}</p>
              <p className="text-stone-500 text-sm font-medium">Published</p>
            </div>
          </div>

          {/* Drafts */}
          <div className="stats-card bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-amber-50 transition-colors">
                <svg className="w-6 h-6 text-stone-600 group-hover:text-amber-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Work in Progress</span>
            </div>
            <div>
              <p className="text-4xl font-bold text-stone-800 mb-1">{stats.draftPosts}</p>
              <p className="text-stone-500 text-sm font-medium">Drafts</p>
            </div>
          </div>

          {/* Total Views */}
          <div className="stats-card bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/60 hover:shadow-lg transition-all duration-300 group">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-stone-100 rounded-2xl group-hover:bg-purple-50 transition-colors">
                <svg className="w-6 h-6 text-stone-600 group-hover:text-purple-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider">Engagement</span>
            </div>
            <div>
              <p className="text-4xl font-bold text-stone-800 mb-1">{stats.totalViews.toLocaleString()}</p>
              <p className="text-stone-500 text-sm font-medium">Total Views</p>
            </div>
          </div>
        </div>

        {/* Blog List */}
        <div className="bg-white rounded-[2.5rem] shadow-sm border border-stone-200 overflow-hidden">
          <div className="blog-list-header p-8 border-b border-stone-100 bg-white">
            <h2 className="text-xl font-serif font-bold text-stone-800">All Blog Posts</h2>
          </div>

          <div className="divide-y divide-stone-100">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog.id} className="blog-item group p-6 hover:bg-stone-50/50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Blog Info */}
                    <div className="flex-1 flex gap-6">
                      {/* Thumbnail */}
                      <div className="hidden sm:block w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 shadow-inner">
                        {blog.featuredImage?.url || blog.featuredImage || blog.image ? (
                          <img
                            src={blog.featuredImage?.url || blog.featuredImage || blog.image}
                            alt={blog.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-300">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center flex-wrap gap-3 mb-2">
                          <h3 className="text-xl font-bold text-stone-800 group-hover:text-teal-600 transition-colors">
                            {blog.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${getStatusColor(blog.status)}`}>
                            {blog.status}
                          </span>
                        </div>

                        <p className="text-stone-500 mb-3 line-clamp-1 font-light">
                          {blog.excerpt}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-stone-400">
                          <span className="flex items-center gap-1.5 bg-stone-100 px-2 py-1 rounded-md">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            {blog.category}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {blog.readTime} min read
                          </span>
                          <span className="hidden sm:flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {blog.views || 0} views
                          </span>
                          <span className="hidden sm:flex items-center gap-1.5">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {blog.comments?.length || 0} comments
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Link
                        to={`/admin/edit/${blog.id}`}
                        className="p-3 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition-all"
                        title="Edit"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="p-3 text-stone-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-12 text-center text-stone-500">
                <p>No blog posts yet. Start writing!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ManageBlog
