const express = require('express');
const router = express.Router();
const { 
  login, 
  register, 
  getProfile, 
  updateProfile, 
  changePassword 
} = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

// Public routes with rate limiting
router.post('/login', authLimiter, login);
router.post('/register', authLimiter, register);

// Protected routes
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfile);
router.put('/change-password', auth, changePassword);

module.exports = router;