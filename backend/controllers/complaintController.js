const Complaint = require('../models/Complaint');

// @desc    Submit a new complaint
// @route   POST /api/complaints
// @access  Private
const submitComplaint = async (req, res) => {
  const { title, description, category, location, userEmail } = req.body;

  try {
    const totalComplaints = await Complaint.countDocuments();
    const complaintId = `GRV-${1000 + totalComplaints + 1}`;

    const priorities = ['High', 'Medium', 'Low'];
    const priority = priorities[Math.floor(Math.random() * priorities.length)];

    const complaint = await Complaint.create({
      complaintId,
      title,
      description,
      category,
      location,
      userEmail,
      priority,
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
    const { id } = req.params;
    let query = { complaintId: id };

    if (id.match(/^[0-9a-fA-F]{24}$/)) {
      query = { $or: [{ complaintId: id }, { _id: id }] };
    }

    const complaint = await Complaint.findOne(query);

    if (complaint) {
      complaint.status = req.body.status || complaint.status;
      complaint.department = req.body.department || complaint.department;
      
      if (req.body.subTasks) {
        complaint.subTasks = req.body.subTasks;
      }
      
      const updatedComplaint = await complaint.save();
      res.json(updatedComplaint);
    } else {
      res.status(404).json({ message: 'Complaint not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get complaint stats for transparency dashboard
// @route   GET /api/complaints/stats
// @access  Public
const getComplaintStats = async (req, res) => {
  try {
    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const pending = total - resolved;

    // Category distribution
    const categories = await Complaint.aggregate([
      { $group: { _id: '$category', value: { $sum: 1 } } },
      { $project: { name: '$_id', value: 1, _id: 0 } },
    ]);

    // Monthly trend (last 6 months)
    const monthlyTrend = await Complaint.aggregate([
      {
        $group: {
          _id: { $substr: ['$createdAt', 0, 7] }, // Group by YYYY-MM
          complaints: { $sum: 1 },
        },
      },
      { $project: { month: '$_id', complaints: 1, _id: 0 } },
      { $sort: { month: 1 } },
      { $limit: 6 },
    ]);

    res.json({
      total,
      resolved,
      pending,
      categoryDistribution: categories,
      monthlyTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get complaints for a specific department
// @route   GET /api/complaints/dept/:deptName
// @access  Private
const getDepartmentComplaints = async (req, res) => {
  try {
    const { deptName } = req.params;
    
    // Security Check: Only admin or the specific department can access these tasks
    if (req.user.role !== 'admin' && (req.user.role !== 'department' || req.user.department !== deptName)) {
      return res.status(403).json({ message: 'Forbidden: Access denied to this department data' });
    }

    // Find complaints where either main department is this OR there's a subtask for this dept
    const complaints = await Complaint.find({
      $or: [
        { department: deptName },
        { 'subTasks.department': deptName }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  submitComplaint,
  getAllComplaints,
  getComplaintById,
  getUserComplaints,
  updateComplaint,
  getComplaintStats,
  getDepartmentComplaints,
};
