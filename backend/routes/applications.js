const express = require('express');
const router = express.Router();
const Application = require('../models/Application'); // Import Application model
const Resource = require('../models/Resource'); // Assuming jobs are stored in Resource model

// POST /api/applications - Create a new application
router.post('/', async (req, res) => {
  try {
    const { jobId, email, whatsapp } = req.body;

    // Validate required fields
    if (!jobId || !email || !whatsapp) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the job exists
    const job = await Resource.findById(jobId);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Create and save the application
    const newApplication = new Application({ jobId, email, whatsapp });
    const savedApplication = await newApplication.save();
    res.status(201).json(savedApplication);
  } catch (err) {
    console.error('Error creating application:', err.message);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

// GET /api/applications - Retrieve all applications or filter by job
router.get('/', async (req, res) => {
  try {
    const { jobId } = req.query; // Optional query parameter for filtering by job
    let applications;

    if (jobId) {
      // Fetch applications for a specific job
      applications = await Application.find({ jobId });
      if (applications.length === 0) {
        return res.status(404).json({ error: 'No applications found for the specified job' });
      }
    } else {
      // Fetch all applications
      applications = await Application.find();
    }

    res.status(200).json(applications);
  } catch (err) {
    console.error('Error fetching applications:', err.message);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// DELETE /api/applications/:id - Delete an application by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedApplication = await Application.findByIdAndDelete(id);

    if (!deletedApplication) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (err) {
    console.error('Error deleting application:', err.message);
    res.status(500).json({ error: 'Failed to delete application' });
  }
});

module.exports = router;
