const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check for Cloudinary environment variables
if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
  console.warn("⚠️  WARNING: Cloudinary credentials not found in environment variables!");
  console.warn("⚠️  Image uploads will not work. Please set CLOUD_NAME, CLOUD_API_KEY, and CLOUD_API_SECRET.");
}

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || 'demo',
    api_key: process.env.CLOUD_API_KEY || 'demo',
    api_secret: process.env.CLOUD_API_SECRET || 'demo',
  });
  
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: "HospitalCare",
      allowedFormats: ["png", "jpg", "jpeg"],
    },
  });

  module.exports={
    cloudinary,
    storage,
  }