const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const { uploadResume, getResumes, getResumeFile } = require('../controllers/resumeController');

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
if (!require('fs').existsSync(UPLOAD_DIR)) require('fs').mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1e9) + ext);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Unsupported file type'), false);
};

const upload = multer({ storage, fileFilter, limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880') } });

// Allow anonymous uploads when ALLOW_ANON_UPLOADS=true in .env (convenience for demos)
const maybeAuth = (req, res, next) => {
  if (process.env.ALLOW_ANON_UPLOADS === 'true') return next();
  return auth(req, res, next);
}

router.post('/upload', maybeAuth, upload.single('resume'), uploadResume);
router.get('/', auth, getResumes);
router.get('/:id/file', auth, getResumeFile);

module.exports = router;
