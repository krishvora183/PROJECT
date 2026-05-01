const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    relatedId: { type: String },
    description: { type: String, required: true },
    status: { type: String, enum: ['Open', 'Resolved'], default: 'Open' },
  },
  { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
