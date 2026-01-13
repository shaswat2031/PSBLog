const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

/**
 * Security middleware configuration
 */

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login/register requests per windowMs
  message: { 
    success: false, 
    message: 'Too many authentication attempts. Please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many requests. Please try again later.' 
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet configuration for security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Sanitize error messages for production
 * Prevents sensitive information leakage
 */
const sanitizeError = (error) => {
  // In production, only return generic error messages
  if (process.env.NODE_ENV === 'production') {
    return 'An error occurred. Please try again later.';
  }
  // In development, return more detailed errors (but never passwords or tokens)
  return error.message || 'An error occurred';
};

/**
 * Safe error logger
 * Logs errors without exposing sensitive data
 */
const logError = (context, error) => {
  // Only log non-sensitive information
  const safeError = {
    context,
    message: error.message,
    timestamp: new Date().toISOString(),
    // Exclude stack traces in production
    ...(process.env.NODE_ENV !== 'production' && { stack: error.stack })
  };
  
  // In production, use proper logging service
  // In development, use console for debugging
  if (process.env.NODE_ENV === 'production') {
    // TODO: Replace with proper logging service (e.g., Winston, Bunyan)
    // logger.error(safeError);
  } else {
    console.error('Error:', safeError);
  }
};

/**
 * Validate request input
 */
const validateInput = (fields) => {
  return (req, res, next) => {
    const errors = [];
    
    fields.forEach(field => {
      if (!req.body[field]) {
        errors.push(`${field} is required`);
      }
    });
    
    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }
    
    next();
  };
};

/**
 * Sanitize user object before sending to client
 * Removes sensitive fields
 */
const sanitizeUser = (user) => {
  if (!user) return null;
  
  const userObj = user.toObject ? user.toObject() : user;
  
  // Remove sensitive fields
  const { password, __v, ...safeUser } = userObj;
  
  return safeUser;
};

module.exports = {
  authLimiter,
  apiLimiter,
  helmetConfig,
  sanitizeError,
  logError,
  validateInput,
  sanitizeUser
};
