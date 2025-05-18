const mongoose = require('mongoose');

// Define the schema for the Resource model
const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  type: {
    type: String,
    required: [true, 'Type is required'], // Corrected validation message
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
  },
  pricing: {
    type: Number,
    required: [true, 'Pricing is required'],
  },
  deadline: {
    type: String,
    required: [true, 'Deadline is required'],
    
  },
  status: {
    type: String,
    enum: ['active', 'pending', 'completed'], // Limit the values for status
    default: 'active',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Export the Resource model
module.exports = mongoose.model('Resource', ResourceSchema);
