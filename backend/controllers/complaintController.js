const Complaint = require('../models/Complaint');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private
const submitComplaint = async (req, res) => {
  const { title, description, category, location, userEmail } = req.body;

  try {
    const totalComplaints = await Complaint.countDocuments();
    const complaintId = `GRV-${1000 + totalComplaints + 1}`;

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category,
      location,
      userEmail,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all complaints (with filters)
// @route   GET /api/complaints
// @access  Private/Admin
const getAllComplaints = async (req, res) => {
  const { status, category, search } = req.query;
  let query = {};

  if (status) query.status = status;
  if (category) query.category = category;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { complaintId: { $regex: search, $options: 'i' } },
    ];
  }

  try {
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaint by ID
// @route   GET /api/complaints/:id
// @access  Public
const getComplaintById = async (req, res) => {
  try {
    const { id } = req.params;
    let query = { complaintId: id };

    // If it looks like a MongoDB ObjectId, allow searching by _id too
    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ complaintId: id }, { _id: id }] };
    }

    const complaint = await Complaint.findOne(query);

    if (complaint) {
      res.json(complaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user complaints
// @route   GET /api/complaints/user/:email
// @access  Private
const getUserComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ userEmail: req.params.email }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update complaint
// @route   PATCH /api/complaints/:id
// @access  Private/Admin
const updateComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });

    if (complaint) {
      complaint.status = req.body.status || complaint.status;
      complaint.department = req.body.department || complaint.department;
      
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  getUserComplaints,
  updateComplaint,
};
