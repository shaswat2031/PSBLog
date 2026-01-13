import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import MDEditor from '@uiw/react-md-editor'

const BlogId = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentForm, setCommentForm] = useState({ name: '', email: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [error, setError] = useState('');
  const [recommendedBlogs, setRecommendedBlogs] = useState([]);


  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/blogs/${id}`);
        if (response.ok) {
          const blogData = await response.json();
          setBlog(blogData.data);
        } else {
          setError('Blog not found');
        }
      } catch (error) {
        setError('Failed to load blog');
        console.error('Error fetching blog:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  // Fetch recommended blogs
  useEffect(() => {
    const fetchRecommendedBlogs = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${baseUrl}/api/blogs?limit=3`);
        if (response.ok) {
          const data = await response.json();
          // Filter out the current blog
          const filtered = data.data.filter(b => b.slug !== id && b.id !== id);
          setRecommendedBlogs(filtered.slice(0, 3));
        }
      } catch (error) {
        console.error('Error fetching recommended blogs:', error);
      }
    };

    if (blog) {
      fetchRecommendedBlogs();
    }
  }, [id, blog]);

  const refreshBlog = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${baseUrl}/api/blogs/${id}`);
      if (response.ok) {
        const blogData = await response.json();
        setBlog(blogData.data);
      }
    } catch (error) {
      console.error('Error refreshing blog:', error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.content.trim()) {
      setError('Name and comment are required');
      return;
    }

    try {
      setSubmittingComment(true);
      setError('');

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

      const response = await fetch(`${baseUrl}/api/blogs/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: commentForm.name,
          email: commentForm.email,
          content: commentForm.content
        })
      });

      if (response.ok) {
        // Refresh blog data to get updated comments
        await refreshBlog();
        // Reset form
        setCommentForm({ name: '', email: '', content: '' });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to submit comment');
      }
    } catch (error) {
      setError('Failed to submit comment');
      console.error('Error submitting comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleInputChange = (e) => {
    setCommentForm({
      ...commentForm,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-stone-200 rounded mb-4"></div>
          <div className="h-64 bg-stone-200 rounded mb-6"></div>
          <div className="space-y-3">
            <div className="h-4 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded"></div>
            <div className="h-4 bg-stone-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !blog) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="text-red-600 text-lg">{error}</div>
        <Link to="/blogs" className="text-teal-600 hover:text-teal-700 mt-4 inline-block">
          ← Back to Blogs
        </Link>
      </div>
    );
  }

  if (!blog) return null;

  return (
    <article className="max-w-4xl mx-auto px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-stone-500 mb-8">
        <Link to="/" className="hover:text-teal-600 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/blogs" className="hover:text-teal-600 transition-colors">Articles</Link>
        <span>/</span>
        <span className="text-stone-700">{blog.title}</span>
      </nav>

      {/* Article Header */}
      <header className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium uppercase tracking-wide">
            {blog.category}
          </span>
          <span className="text-stone-500">{blog.readTime}</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-800 mb-6 leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center justify-between flex-wrap gap-4 pb-6 border-b border-stone-200">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-100 to-amber-100 rounded-full flex items-center justify-center">
                <span className="text-teal-700 font-semibold">
                  {(blog.authorName || blog.author?.name || 'Anonymous').split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div>
                <p className="font-semibold text-stone-800">{blog.authorName || blog.author?.name || 'Anonymous'}</p>
                <p className="text-sm text-stone-500">{new Date(blog.createdAt || blog.date).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      {(blog.featuredImage?.url || blog.featuredImage || blog.image) && (
        <div className="mb-12">
          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-teal-50 to-amber-50">
            <img
              src={blog.featuredImage?.url || blog.featuredImage || blog.image}
              alt={blog.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.innerHTML = '<div class="w-full h-full flex items-center justify-center text-stone-400"><svg class="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg></div>';
              }}
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <div className="prose prose-lg prose-stone max-w-none mb-12">
        <div className="text-lg text-stone-700 leading-relaxed" data-color-mode="light">
          <MDEditor.Markdown source={blog.content} />
        </div>
      </div>

      {/* Tags */}
      <div className="mb-12 pt-8 border-t border-stone-200">
        <h3 className="text-lg font-semibold text-stone-800 mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {blog.tags.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-stone-100 text-stone-600 rounded-full text-sm hover:bg-stone-200 transition-colors cursor-pointer">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Comments Section */}
      <section className="mb-12 pt-8 border-t border-stone-200">
        <h3 className="text-2xl font-serif font-bold text-stone-800 mb-8">Comments ({blog.comments ? blog.comments.length : 0})</h3>

        {/* Add Comment Form */}
        <form onSubmit={handleCommentSubmit} className="mb-8 bg-stone-50 rounded-2xl p-6">
          <h4 className="font-semibold text-stone-800 mb-4">Add a Comment</h4>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              name="name"
              placeholder="Your name *"
              value={commentForm.name}
              onChange={handleInputChange}
              required
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email (optional)"
              value={commentForm.email}
              onChange={handleInputChange}
              className="px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
            />
          </div>

          <textarea
            name="content"
            value={commentForm.content}
            onChange={handleInputChange}
            placeholder="Share your thoughts... *"
            rows="4"
            required
            className="w-full px-4 py-3 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all resize-none mb-4"
          />

          <button
            type="submit"
            disabled={submittingComment}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {submittingComment ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Submitting...</span>
              </>
            ) : (
              <span>Submit Comment</span>
            )}
          </button>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {blog.comments && blog.comments.length > 0 ? (
            blog.comments.map((comment) => (
              <div key={comment._id} className="bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-teal-700 font-semibold text-sm">
                      {comment.author.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-stone-800">{comment.author.name}</h5>
                      <span className="text-sm text-stone-500">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-stone-700 leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-stone-500">
              <p>No comments yet. Be the first to share your thoughts!</p>
            </div>
          )}
        </div>
      </section>

      {/* Recommended Blogs */}
      {recommendedBlogs.length > 0 && (
        <section className="pt-8 border-t border-stone-200">
          <h3 className="text-2xl font-serif font-bold text-stone-800 mb-8">Recommended Reading</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendedBlogs.map((recBlog) => (
              <Link key={recBlog.id || recBlog._id} to={`/blog/${recBlog.slug || recBlog.id}`} className="group">
                <article className="bg-white rounded-xl p-6 border border-stone-100 hover:shadow-lg transition-all duration-300 h-full">
                  <h4 className="text-lg font-semibold text-stone-800 mb-2 group-hover:text-teal-600 transition-colors">
                    {recBlog.title}
                  </h4>
                  <p className="text-stone-600 text-sm mb-3 leading-relaxed">
                    {recBlog.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>{recBlog.readTime} min read</span>
                    <span className="flex items-center space-x-1 group-hover:text-teal-600 transition-colors">
                      <span>Read more</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link to="/blogs" className="inline-flex items-center px-6 py-3 bg-stone-100 text-stone-700 rounded-full hover:bg-stone-200 transition-colors font-medium">
              View All Articles
              <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}
    </article>
  )
}

export default BlogId
