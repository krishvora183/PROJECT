const express = require('express');
const router = express.Router();
const { registerUser, authUser, getUsers } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', authUser);
router.get('/users', protect, admin, getUsers);

module.exports = router;
