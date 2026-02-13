const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const multer = require('multer');
require('dotenv').config();

// Configure S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|webp|WEBP)$/)) {
      req.fileValidationError = 'Only image files are allowed!';
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  },
});

/**
 * Upload a file to Cloudflare R2
 * @param {Buffer} fileBuffer - The file buffer
 * @param {string} fileName - The file name
 * @param {string} mimetype - The file mimetype
 * @returns {Promise<string>} - The public URL of the uploaded file
 */
async function uploadToR2(fileBuffer, fileName, mimetype) {
  const timestamp = Date.now();
  const key = `products/${timestamp}-${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.R2_BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimetype,
  });

  try {
    await s3Client.send(command);

    // Return the public URL
    const publicUrl = `${process.env.R2_PUBLIC_URL}/${key}`;
    return publicUrl;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error('Failed to upload image to R2');
  }
}

module.exports = {
  upload,
  uploadToR2,
  s3Client,
};
