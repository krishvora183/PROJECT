const express = require('express');
const router = express.Router();
const { createServiceRequest, getMyServiceRequests, getServiceRequests, updateServiceRequestStatus } = require('../controllers/serviceController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createServiceRequest).get(protect, admin, getServiceRequests);
router.route('/myrequests').get(protect, getMyServiceRequests);
router.route('/:id/status').put(protect, admin, updateServiceRequestStatus);

module.exports = router;
