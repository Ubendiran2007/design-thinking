const express = require('express');
const {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  getUserComplaints,
  updateComplaint,
  getComplaintStats,
  getDepartmentComplaints,
} = require('../controllers/complaintController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, admin, getAllComplaints).post(protect, submitComplaint);
router.get('/stats', getComplaintStats);
router.get('/user/:email', protect, getUserComplaints);
router.get('/dept/:deptName', protect, getDepartmentComplaints);
router.route('/:id').get(getComplaintById).patch(protect, updateComplaint);

module.exports = router;
