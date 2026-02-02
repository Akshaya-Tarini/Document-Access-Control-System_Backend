const express = require('express');
const router = express.Router();
const { authenticate, authorizeRole } = require('../middleware/auth');
const { requestAccess, listRequests, reviewRequest } = require('../controllers/accessController');

router.use(authenticate);

// Users request access
router.post('/request/:id', authorizeRole(['USER']), requestAccess);

// Users view their requests; Admin view all
router.get('/', listRequests);

// Admin reviews request
router.post('/review/:id', authorizeRole(['ADMIN']), reviewRequest);

module.exports = router;