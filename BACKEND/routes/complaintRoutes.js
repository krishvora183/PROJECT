const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints, getComplaints, updateComplaintStatus } = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, createComplaint).get(protect, admin, getComplaints);
router.route('/mycomplaints').get(protect, getMyComplaints);
router.route('/:id/status').put(protect, admin, updateComplaintStatus);

module.exports = router;
