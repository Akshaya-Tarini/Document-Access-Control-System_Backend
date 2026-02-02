const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { authenticate, authorizeRole } = require('../middleware/auth');
const { uploadDocument, listDocuments, downloadDocument } = require('../controllers/documentController');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.resolve(__dirname, '../../uploads')),
  filename: (req, file, cb) => cb(null, `${Date.now()}_${file.originalname}`)
});
const upload = multer({ storage });

router.use(authenticate);

router.get('/', listDocuments);
router.get('/:id/download', downloadDocument);

// Admin routes
router.post('/', authorizeRole(['ADMIN']), upload.single('file'), uploadDocument);

module.exports = router;