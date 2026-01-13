const express = require('express');
const router = express.Router();
const { upload, handleMulterError } = require('../middleware/upload');
const { formatResponse } = require('../utils/helpers');
const { adminAuth } = require('../middleware/auth');

/**
 * Upload single image
 * POST /api/upload/image
 */
router.post('/image', adminAuth, upload.single('image'), handleMulterError, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json(
        formatResponse(false, 'No file uploaded')
      );
    }

    // Multer Cloudinary storage already handled the upload
    // req.file now contains the Cloudinary URL and metadata

    res.json(
      formatResponse(true, 'Image uploaded successfully', {
        url: req.file.path,
        publicId: req.file.filename,
        // width and height might be available in req.file metadata depending on transformer
        // but often not directly top-level in req.file for multer-storage-cloudinary without specific config 
        // Just return what we have
      })
    );
  } catch (error) {
    console.error('Upload image error:', error);
    res.status(500).json(
      formatResponse(false, 'Failed to upload image')
    );
  }
});

module.exports = router;