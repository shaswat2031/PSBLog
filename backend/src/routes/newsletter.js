const express = require('express');
const router = express.Router();
const {
    subscribe,
    unsubscribe,
    getSubscriberCount,
    getSubscribers,
    notifySubscribers
} = require('../controllers/newsletterController');
const { adminAuth } = require('../middleware/auth');

// Public routes
router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);

// Admin routes
router.get('/count', adminAuth, getSubscriberCount);
router.get('/subscribers', adminAuth, getSubscribers);
router.post('/notify/:blogId', adminAuth, notifySubscribers);

module.exports = router;
