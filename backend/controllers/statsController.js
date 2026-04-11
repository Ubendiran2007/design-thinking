const Complaint = require('../models/Complaint');

// @desc    Get transparency statistics
// @route   GET /api/stats
// @access  Public
const getTransparencyStats = async (req, res) => {
  try {
    const complaints = await Complaint.find({});
    
    const total = complaints.length;
    const resolved = complaints.filter((item) => item.status === 'Resolved').length;
    const pending = total - resolved;

    const categoryMap = complaints.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});
    
    const categoryDistribution = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

    // Mock monthly trend as it requires more complex logic or more data over time
    const monthlyTrend = [
      { month: 'Jan', complaints: 12 },
      { month: 'Feb', complaints: 18 },
      { month: 'Mar', complaints: 22 },
      { month: 'Apr', complaints: total },
    ];

    res.json({
      total,
      resolved,
      pending,
      categoryDistribution,
      monthlyTrend,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTransparencyStats };
