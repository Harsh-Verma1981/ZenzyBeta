import path from "path";
import express from "express";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const router = express.Router();

// 1. Configure Cloudinary using your Render Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 2. Setup Cloudinary Storage instead of diskStorage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'zenzloom_products', // The folder name in your Cloudinary dashboard
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }], // Optional: Resizes large images
  },
});

// 3. Keep your professional file validation logic
const fileFilter = (req, file, cb) => {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype;

  if (filetypes.test(extname) && mimetypes.test(mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
};

const upload = multer({ storage, fileFilter });

// 4. The Upload Route
router.post("/", upload.single("image"), (req, res) => {
  if (req.file) {
    res.status(200).send({
      message: "Image uploaded successfully to Cloudinary",
      // IMPORTANT: req.file.path is now the full HTTPS URL
      image: req.file.path, 
    });
  } else {
    res.status(400).send({ message: "No image file provided" });
  }
});

export default router;