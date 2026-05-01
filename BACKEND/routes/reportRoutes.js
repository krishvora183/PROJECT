const express = require('express');
const router = express.Router();
const { getDashboardStats, getDetailedAnalytics } = require('../controllers/reportController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/dashboard', protect, admin, getDashboardStats);
router.get('/analytics', protect, admin, getDetailedAnalytics);

module.exports = router;
