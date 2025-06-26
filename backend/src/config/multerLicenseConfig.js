const multer = require('multer');
const path = require('path');

// Storage for license files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads/licenses'));
  },
  filename: (req, file, cb) => {
    // Support both general user and chauffeur uploads
    let id = null;
    let prefix = 'user';
    if (req.chauffeur && (req.chauffeur.id || req.chauffeur.ChauffeurID)) {
      id = req.chauffeur.id || req.chauffeur.ChauffeurID;
      prefix = 'chauffeur';
    } else if (req.user && (req.user.id || req.user.UserID)) {
      id = req.user.id || req.user.UserID;
      prefix = 'user';
    }
    // fallback if no id found
    if (!id) id = 'unknown';
    cb(null, `${prefix}-${id}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

// Allow images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);
  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image or PDF files are allowed!'));
  }
};

const uploadLicense = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

module.exports = uploadLicense;
