const ServiceRequest = require('../models/ServiceRequest');

// @desc    Create a service request
// @route   POST /api/services
// @access  Private
const createServiceRequest = async (req, res) => {
  const { serviceType, description } = req.body;

  try {
    const serviceRequest = new ServiceRequest({
      user: req.user._id,
      serviceType,
      description,
    });

    const createdRequest = await serviceRequest.save();
    res.status(201).json(createdRequest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user's service requests
// @route   GET /api/services/myrequests
// @access  Private
const getMyServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({ user: req.user._id });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all service requests
// @route   GET /api/services
// @access  Private/Admin
const getServiceRequests = async (req, res) => {
  try {
    const requests = await ServiceRequest.find({}).populate('user', 'id name email');
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update service request status
// @route   PUT /api/services/:id/status
// @access  Private/Admin
const updateServiceRequestStatus = async (req, res) => {
  try {
    const request = await ServiceRequest.findById(req.params.id);

    if (request) {
      request.status = req.body.status || request.status;
      const updatedRequest = await request.save();
      res.json(updatedRequest);
    } else {
      res.status(404).json({ message: 'Service request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createServiceRequest, getMyServiceRequests, getServiceRequests, updateServiceRequestStatus };
