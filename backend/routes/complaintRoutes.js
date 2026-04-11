const express = require('express');
const {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  getUserComplaints,
  updateComplaint,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, admin, getAllComplaints).post(protect, submitComplaint);
router.get('/user/:email', protect, getUserComplaints);
router.route('/:id').get(getComplaintById).patch(protect, admin, updateComplaint);

module.exports = router;
