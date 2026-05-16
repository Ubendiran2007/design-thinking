const mongoose = require('mongoose');

const subTaskSchema = mongoose.Schema({
  taskName: { type: String, required: true },
  department: { type: String, required: true },
  status: { 
    type: String, 
    required: true, 
    default: 'Pending',
    enum: ['Pending', 'In Progress', 'Completed']
  }
}, { _id: true });

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
    priority: {
      type: String,
      required: true,
      enum: ['High', 'Medium', 'Low'],
      default: 'Medium',
    },
    subTasks: [subTaskSchema],
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
