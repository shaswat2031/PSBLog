import React, { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { blogAPI, uploadAPI } from '../services/blogService'
import MDEditor from '@uiw/react-md-editor'
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

const WriteAndEditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const containerRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    image: '',
    status: 'draft'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // Fetch blog data if editing
  useEffect(() => {
    if (isEdit && id) {
      fetchBlogData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEdit]);

  // GSAP Animations (Kept subtle for the form interactions if desired, limiting initial "pop-up" if that's the concern)
  // User asked to "remove GSAp andimaiton on open animaiton" specifically for ManageBlog, 
  // but "fixx also these" for this page might imply similar cleanup. 
  // I will make the entrance animation very subtle or remove it if problematic. 
  // Let's keep it but very fast/subtle.
  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(".header-animate", {
      y: 15,
      opacity: 0,
      duration: 0.5
    })
      .from(".form-section", {
        y: 15,
        opacity: 0,
        duration: 0.5,
        stagger: 0.05
      }, "-=0.3")
  }, { scope: containerRef });

  // Fetch blog data for editing
  const fetchBlogData = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getBlogByIdAdmin(id);

      if (response.success) {
        const blog = response.data;
        setFormData({
          title: blog.title || '',
          content: blog.content || '',
          excerpt: blog.excerpt || '',
          category: blog.category || '',
          tags: blog.tags?.join(', ') || '',
          image: blog.featuredImage?.url || blog.featuredImage || blog.image || '',
          status: blog.status || 'draft'
        });
        setImagePreview(blog.featuredImage?.url || blog.featuredImage || blog.image || '');
      } else {
        setError(response.message || 'Failed to load blog data');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err.message || 'Failed to load blog data');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (status = 'draft') => {
    try {
      setLoading(true);
      setError('');

      // Validate required fields
      if (!formData.title.trim() || !formData.content.trim() || !formData.excerpt.trim()) {
        setError('Title, excerpt, and content are required');
        setLoading(false);
        return;
      }

      let imageUrl = formData.image;

      // Upload image if new file selected
      if (imageFile) {
        try {
          const uploadResponse = await uploadAPI.uploadImage(imageFile);
          if (uploadResponse.success) {
            imageUrl = uploadResponse.data.url;
          }
        } catch (uploadErr) {
          console.error('Image upload failed:', uploadErr);
          setError('Image upload failed. Continuing without image.');
        }
      }

      const blogData = {
        ...formData,
        featuredImage: imageUrl,
        status
      };

      let response;
      if (isEdit) {
        response = await blogAPI.updateBlog(id, blogData);
      } else {
        response = await blogAPI.createBlog(blogData);
      }

      if (response.success) {
        navigate('/admin/manage');
      } else {
        setError(response.message || 'Failed to save blog');
      }
    } catch (err) {
      setError(err.message || 'Failed to save blog');
      console.error('Error saving blog:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDraft = () => {
    handleSubmit('draft');
  };

  const handlePublish = () => {
    handleSubmit('published');
  };

  if (loading && isEdit) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-stone-500 font-medium">Loading your masterpiece...</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-stone-100 px-6 pb-12 pt-32 md:px-12 md:pb-12 md:pt-32 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="header-animate flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-3 tracking-tight">
              {isEdit ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-lg text-stone-500 font-light">
              {isEdit ? 'Refine your thoughts and update your content' : 'Share your knowledge and inspire readers'}
            </p>
          </div>
          <div className="flex items-center space-x-4 mt-6 sm:mt-0">
            <button
              type="button"
              onClick={() => navigate('/admin/manage')}
              className="px-6 py-3 text-stone-500 hover:text-stone-800 transition-colors font-medium hover:bg-stone-100/50 rounded-xl"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={loading}
              className="px-8 py-3 bg-white border border-stone-200 text-stone-700 rounded-full hover:bg-stone-50 hover:border-stone-300 transition-all font-medium disabled:opacity-50 shadow-sm hover:shadow-md"
            >
              Save Draft
            </button>
          </div>
        </div>

        {error && (
          <div className="header-animate bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 flex items-center space-x-3">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        <form onSubmit={(e) => e.preventDefault()} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Title input */}
              <div className="form-section bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-stone-200">
                <label htmlFor="title" className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Article Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter an engaging title..."
                  className="w-full px-0 py-2 text-3xl md:text-4xl font-serif font-bold bg-transparent border-b-2 border-stone-100 focus:border-stone-900 focus:outline-none transition-all placeholder-stone-300 text-stone-800"
                />
              </div>

              {/* Excerpt */}
              <div className="form-section bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-stone-200">
                <label htmlFor="excerpt" className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                  Summary / Excerpt
                </label>
                <textarea
                  id="excerpt"
                  name="excerpt"
                  rows="3"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Write a compelling summary that hooks the reader..."
                  className="w-full px-4 py-3 bg-stone-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500/20 text-stone-600 transition-all resize-none placeholder-stone-400 leading-relaxed"
                />
                <p className="text-xs text-stone-400 mt-2 text-right">
                  Displayed in search results and cards
                </p>
              </div>

              {/* Content Editor */}
              <div className="form-section bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-sm border border-stone-200">
                <label htmlFor="content" className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
                  Content
                </label>
                <div className="rounded-2xl overflow-hidden border border-stone-100 shadow-inner" data-color-mode="light">
                  <MDEditor
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value || '' })}
                    height={600}
                    preview="live"
                    className="!bg-white !font-sans"
                    visibleDragbar={false}
                  />
                </div>
                <div className="flex items-center justify-between mt-4 text-xs font-medium text-stone-400">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Markdown Supported
                  </span>
                  <span>{formData.content?.length || 0} chars</span>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Actions Card (Mobile/Sticky) */}
              <div className="form-section bg-stone-900 text-white rounded-[2rem] p-6 shadow-xl sticky top-24 z-10 transition-all">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-lg">Publishing</h3>
                  <div className={`w-3 h-3 rounded-full ${formData.status === 'published' ? 'bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-amber-400'}`}></div>
                </div>

                <button
                  type="button"
                  onClick={handlePublish}
                  disabled={loading}
                  className="w-full px-6 py-4 bg-teal-500 text-white rounded-xl hover:bg-teal-400 hover:shadow-lg hover:-translate-y-0.5 transition-all font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 mb-3"
                >
                  {loading ? (
                    <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <>
                      <span>{isEdit ? 'Update Article' : 'Publish Now'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </>
                  )}
                </button>
                <p className="text-xs text-stone-400 text-center">
                  {formData.status === 'published' ? 'Currently live to the world' : 'Will be saved as a draft first'}
                </p>
              </div>

              {/* Settings */}
              <div className="form-section bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-stone-200">
                <h3 className="font-serif font-bold text-xl text-stone-800 mb-6">Settings</h3>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Status
                    </label>
                    <div className="flex bg-stone-100 p-1 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'draft' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.status === 'draft' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                      >
                        Draft
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, status: 'published' })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${formData.status === 'published' ? 'bg-teal-500 text-white shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
                      >
                        Published
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-stone-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500/20 transition-all text-sm font-medium text-stone-700 cursor-pointer hover:bg-stone-100"
                    >
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Programming">Programming</option>
                      <option value="Web Development">Web Development</option>
                      <option value="Lifestyle">Lifestyle</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
                      Tags
                    </label>
                    <div className="relative">
                      <input
                        name="tags"
                        type="text"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="React, CSS, Guide"
                        className="w-full px-4 py-3 pl-10 bg-stone-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500/20 transition-all text-sm font-medium placeholder-stone-400"
                      />
                      <svg className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Image */}
              <div className="form-section bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-sm border border-stone-200">
                <h3 className="font-serif font-bold text-xl text-stone-800 mb-6">Cover Image</h3>

                <div className="space-y-4">
                  <div className="relative group cursor-pointer overflow-hidden rounded-2xl bg-stone-100 aspect-video border-2 border-dashed border-stone-200 hover:border-teal-400 transition-colors">
                    {imagePreview || formData.image ? (
                      <img
                        src={imagePreview || formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400">
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm font-medium">Click to upload</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-stone-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.172-1.172a4 4 0 115.656-5.656l-1.172 1.172a4 4 0 105.656 5.656L20 17.657l-6.172-6.172z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 14.828c.553 0 .931-.53.75-1.07a4.97 4.97 0 01.32-2.122 1 1 0 10-1.875-.72C2.793 12.378 3 13.9 4 14.828z" /></svg>
                    </span>
                    <input
                      name="image"
                      type="url"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="Or paste image URL"
                      className="w-full pl-9 pr-4 py-3 bg-stone-50 border-0 rounded-xl focus:ring-2 focus:ring-teal-500/20 transition-all text-xs font-medium placeholder-stone-400"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default WriteAndEditBlog
