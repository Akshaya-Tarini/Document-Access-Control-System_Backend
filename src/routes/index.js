const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const docRoutes = require('./documents');
const accessRoutes = require('./access');

router.use('/auth', authRoutes);
router.use('/documents', docRoutes);
router.use('/access', accessRoutes);

module.exports = router;