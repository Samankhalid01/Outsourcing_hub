const express = require('express');
const router = express.Router();
const Job = require('../models/job');

// Fetch all jobs
router.get('/', async (req, res) => {
  try {
    // Retrieve all jobs from MongoDB, including relevant fields
    const jobs = await Job.find({}, 'title description pricing deadline status createdAt');
    res.status(200).json(jobs); // Send the jobs as JSON
  } catch (err) {
    console.error('Error fetching jobs:', err.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create a new job
router.post('/', async (req, res) => {
  try {
    const { title, description, pricing, deadline, status } = req.body;

    // Validate the fields
    if (!title || !description || !pricing || !deadline) {
      return res
        .status(400)
        .json({ error: 'Title, description, pricing, and deadline are required' });
    }

    // Create and save the job
    const job = new Job({ title, description, pricing, deadline, status });
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (err) {
    console.error('Error creating job:', err.message);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

module.exports = router; // Ensure the router is exported only once
