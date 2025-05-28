import multer from 'multer';
import path from 'path';
import fs from 'fs';
import type { Express } from 'express';

// Configure storage for uploaded images
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const timestamp = Date.now();
    const fileExt = path.extname(file.originalname).toLowerCase() || '.jpg';
    const filename = `image_${timestamp}${fileExt}`;
    cb(null, filename);
  }
});

// Create multer upload middleware
export const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: function (req, file, cb) {
    // Only allow image files
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed'));
    }
  }
});

// Set up image upload routes
export function setupImageUploadRoutes(app: Express) {
  // Handle image uploads
  app.post('/api/upload/image', imageUpload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }
      
      // Return the URL path to the uploaded image
      const url = `/uploads/${req.file.filename}`;
      return res.json({ url });
    } catch (error) {
      console.error('Error uploading image:', error);
      return res.status(500).json({ message: 'Failed to upload image' });
    }
  });
}