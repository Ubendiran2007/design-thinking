const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    complaintId: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: 'Submitted',
    },
    department: {
      type: String,
      required: true,
      default: 'Pending Assignment',
    },
    userEmail: {
      type: String,
      required: true,
    },
    createdAt: {
      type: String, // String to match frontend format 'YYYY-MM-DD'
      default: () => new Date().toISOString().slice(0, 10),
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

complaintSchema.virtual('id').get(function () {
  return this.complaintId;
});

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;
