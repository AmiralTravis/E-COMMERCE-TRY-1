// /middleware/imageUpload.js
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadPaths = {
  avatar: path.join(__dirname, '../../uploads/avatars'),
  product: path.join(__dirname, '../../uploads/products')
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = req.baseUrl.includes('users') ? 'avatar' : 'product';
    if (!fs.existsSync(uploadPaths[type])) {
      fs.mkdirSync(uploadPaths[type], { recursive: true });
    }
    cb(null, uploadPaths[type]);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = process.env.ALLOWED_IMAGE_TYPES.split(',');
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images are allowed!'), false);
  }
};

module.exports = multer({
  storage,
  fileFilter,
  limits: { fileSize: parseInt(process.env.IMAGE_MAX_SIZE) }
});