// /utils/multerConfig.js

const multer = require('multer');
const upload = multer({
    storage: multer.memoryStorage(), // Store files in memory
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
        files: 20, // Max 20 files
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/gif'
        ];

        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Unsupported file type: ${file.mimetype}. We accept: JPEG, PNG, WEBP, GIF`), false);
        }
    }
});

module.exports = upload;