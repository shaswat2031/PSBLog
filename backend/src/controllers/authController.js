const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { formatResponse, isValidEmail } = require('../utils/helpers');
const { sanitizeError, logError } = require('../middleware/security');

/**
 * Login user
 * POST /api/auth/login
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json(
        formatResponse(false, 'Email and password are required')
      );
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(
        formatResponse(false, 'Invalid email format')
      );
    }

    // Find user
    const user = await User.findOne({ 
      email: email.toLowerCase(),
      isActive: true 
    });

    if (!user) {
      return res.status(401).json(
        formatResponse(false, 'Invalid credentials')
      );
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json(
        formatResponse(false, 'Invalid credentials')
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json(
      formatResponse(true, 'Login successful', {
        user: user.toJSON(),
        token
      })
    );
  } catch (error) {
    logError('Login', error);
    res.status(500).json(
      formatResponse(false, sanitizeError(error))
    );
  }
};

/**
 * Register new user
 * POST /api/auth/register
 */
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json(
        formatResponse(false, 'Name, email and password are required')
      );
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(
        formatResponse(false, 'Invalid email format')
      );
    }

    if (password.length < 8) {
      return res.status(400).json(
        formatResponse(false, 'Password must be at least 8 characters long')
      );
    }

    // Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase() 
    });

    if (existingUser) {
      return res.status(400).json(
        formatResponse(false, 'User already exists with this email')
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json(
      formatResponse(true, 'Registration successful', {
        user: user.toJSON(),
        token
      })
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json(
      formatResponse(false, 'Registration failed')
    );
  }
};

/**
 * Get current user profile
 * GET /api/auth/profile
 */
const getProfile = async (req, res) => {
  try {
    res.json(
      formatResponse(true, 'Profile retrieved successfully', {
        user: req.user
      })
    );
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to retrieve profile')
    );
  }
};

/**
 * Update user profile
 * PUT /api/auth/profile
 */
const updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const user = req.user;

    // Validate input
    if (!name || !email) {
      return res.status(400).json(
        formatResponse(false, 'Name and email are required')
      );
    }

    if (!isValidEmail(email)) {
      return res.status(400).json(
        formatResponse(false, 'Invalid email format')
      );
    }

    // Check if email is already taken by another user
    if (email.toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ 
        email: email.toLowerCase(),
        _id: { $ne: user._id }
      });

      if (existingUser) {
        return res.status(400).json(
          formatResponse(false, 'Email already taken by another user')
        );
      }
    }

    // Update user
    user.name = name.trim();
    user.email = email.toLowerCase().trim();
    await user.save();

    res.json(
      formatResponse(true, 'Profile updated successfully', {
        user: user.toJSON()
      })
    );
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to update profile')
    );
  }
};

/**
 * Change password
 * PUT /api/auth/change-password
 */
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json(
        formatResponse(false, 'Current password and new password are required')
      );
    }

    if (newPassword.length < 8) {
      return res.status(400).json(
        formatResponse(false, 'New password must be at least 8 characters long')
      );
    }

    // Check current password
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isCurrentPasswordValid) {
      return res.status(400).json(
        formatResponse(false, 'Current password is incorrect')
      );
    }

    // Hash and update new password
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    res.json(
      formatResponse(true, 'Password changed successfully')
    );
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to change password')
    );
  }
};

module.exports = {
  login,
  register,
  getProfile,
  updateProfile,
  changePassword
};