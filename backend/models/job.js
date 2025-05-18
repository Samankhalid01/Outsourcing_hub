const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  pricing: { type: Number, required: true },
  deadline: { type: String, required: true }, // Changed to string
  status: { type: String, enum: ['active', 'completed', 'pending'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', JobSchema);
