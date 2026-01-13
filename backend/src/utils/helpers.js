/**
 * Generate slug from text
 * @param {string} text - Text to convert to slug
 * @returns {string} - Generated slug
 */
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Paginate results (supports both Array and Mongoose Model)
 * @param {Array|Object} modelOrData - Array of data or Mongoose Model
 * @param {Object} queryOrPage - Filter query (for Model) or Page number (for Array)
 * @param {Object|number} optionsOrLimit - Options object (for Model) or Limit (for Array)
 * @returns {Object} - Paginated results
 */
const paginate = async (modelOrData, queryOrPage = {}, optionsOrLimit = {}) => {
  // Handle Array pagination
  if (Array.isArray(modelOrData)) {
    const page = typeof queryOrPage === 'number' ? queryOrPage : 1;
    const limit = typeof optionsOrLimit === 'number' ? optionsOrLimit : 10;

    const offset = (page - 1) * limit;
    const paginatedData = modelOrData.slice(offset, offset + limit);

    return {
      data: paginatedData,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(modelOrData.length / limit),
        totalItems: modelOrData.length,
        itemsPerPage: limit,
        hasNext: page < Math.ceil(modelOrData.length / limit),
        hasPrev: page > 1
      }
    };
  }

  // Handle Mongoose Model pagination
  try {
    const model = modelOrData;
    const filter = queryOrPage;
    const options = optionsOrLimit;

    const page = options.page || 1;
    const limit = options.limit || 10;
    const sort = options.sort || { createdAt: -1 };
    const populate = options.populate || '';

    const skip = (page - 1) * limit;

    const [data, totalItems] = await Promise.all([
      model.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate(populate),
      model.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      data,
      pagination: {
        currentPage: page,
        totalPages,
        totalItems,
        itemsPerPage: limit,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    };
  } catch (error) {
    throw new Error(`Pagination error: ${error.message}`);
  }
};

/**
 * Format API response
 * @param {boolean} success - Success status
 * @param {string} message - Response message
 * @param {*} data - Response data
 * @param {Object} meta - Additional metadata
 * @returns {Object} - Formatted response
 */
const formatResponse = (success, message, data = null, meta = {}) => {
  const response = {
    success,
    message,
    timestamp: new Date().toISOString()
  };

  if (data !== null) {
    response.data = data;
  }

  if (Object.keys(meta).length > 0) {
    response.meta = meta;
  }

  return response;
};

/**
 * Calculate estimated reading time
 * @param {string} content - Article content
 * @param {number} wordsPerMinute - Average reading speed
 * @returns {number} - Estimated reading time in minutes
 */
const calculateReadingTime = (content, wordsPerMinute = 200) => {
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute) || 1;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Is valid email
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random string
 * @param {number} length - Length of string
 * @returns {string} - Random string
 */
const generateRandomString = (length = 32) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

module.exports = {
  generateSlug,
  paginate,
  formatResponse,
  calculateReadingTime,
  isValidEmail,
  generateRandomString
};