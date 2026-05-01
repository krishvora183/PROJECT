const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router();

// NOTE: Using memory storage for Vercel serverless compatibility.
// Vercel's filesystem is read-only, so disk storage won't persist files.
// For production image hosting, integrate Cloudinary or AWS S3.
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
});

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Generate a filename (file is in memory, not saved to disk)
  const filename = `${req.file.fieldname}-${Date.now()}${path.extname(req.file.originalname)}`;
  res.send(`/uploads/${filename}`);
});

module.exports = router;
