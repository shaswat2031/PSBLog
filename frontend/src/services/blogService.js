import api from './api';

// Authentication API
export const authAPI = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  async register(name, email, password) {
    const response = await api.post('/auth/register', { name, email, password });
    if (response.success && response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response;
  },

  async getProfile() {
    return api.get('/auth/profile');
  },

  async updateProfile(data) {
    return api.put('/auth/profile', data);
  },

  async changePassword(currentPassword, newPassword) {
    return api.put('/auth/change-password', { currentPassword, newPassword });
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

// Blog API
export const blogAPI = {
  async getBlogs(params = {}) {
    const searchParams = new URLSearchParams(params);
    return api.get(`/blogs?${searchParams}`);
  },

  async getBlogBySlug(slug) {
    return api.get(`/blogs/${slug}`);
  },

  async getAllBlogsAdmin(params = {}) {
    const searchParams = new URLSearchParams(params);
    return api.get(`/blogs/admin/all?${searchParams}`);
  },

  async getBlogByIdAdmin(id) {
    return api.get(`/blogs/admin/${id}`);
  },

  async createBlog(blogData) {
    return api.post('/blogs', blogData);
  },

  async updateBlog(id, blogData) {
    return api.put(`/blogs/${id}`, blogData);
  },

  async deleteBlog(id) {
    return api.delete(`/blogs/${id}`);
  },

  async addComment(blogId, commentData) {
    return api.post(`/blogs/${blogId}/comments`, commentData);
  },

  async likeBlog(blogId) {
    return api.post(`/blogs/${blogId}/like`);
  }
};

// Upload API
export const uploadAPI = {
  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    return api.postFormData('/upload/image', formData);
  },

  async uploadBlogImage(file) {
    const formData = new FormData();
    formData.append('featuredImage', file);
    return api.postFormData('/upload/blog-image', formData);
  }
};

// Categories API
export const categoryAPI = {
  async getCategories() {
    return api.get('/categories');
  },

  async createCategory(categoryData) {
    return api.post('/categories', categoryData);
  },

  async updateCategory(id, categoryData) {
    return api.put(`/categories/${id}`, categoryData);
  },

  async deleteCategory(id) {
    return api.delete(`/categories/${id}`);
  }
};

// Stats API
export const statsAPI = {
  async getDashboardStats() {
    return api.get('/stats/dashboard');
  },

  async getBlogStats(blogId) {
    return api.get(`/stats/blog/${blogId}`);
  }
};

export default {
  authAPI,
  blogAPI,
  uploadAPI,
  categoryAPI,
  statsAPI
};