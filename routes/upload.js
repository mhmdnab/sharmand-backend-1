const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { upload, uploadToR2 } = require('../utils/r2Upload');

// @route   POST api/upload
// @desc    Upload image to R2
// @access  Private (for admin)
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Upload to R2
    const imageUrl = await uploadToR2(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype
    );

    res.json({ url: imageUrl });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: err.message || 'Server Error' });
  }
});

module.exports = router;
