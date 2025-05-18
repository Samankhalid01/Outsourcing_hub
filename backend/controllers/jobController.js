const Job = require('../models/job'); // Correctly import the Job model

// Fetch all jobs
exports.getJobs = async (req, res) => {
  try {
    // Fetch all jobs and select specific fields if needed
    const jobs = await Job.find({}, 'title description pricing deadline status createdAt');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ message: 'Failed to fetch jobs', error: error.message });
  }
};

// Create a job
exports.createJob = async (req, res) => {
  try {
    const { title, description, pricing, deadline, status } = req.body;

    // Validate required fields
    if (!title || !description || !pricing || !deadline) {
      return res
        .status(400)
        .json({ error: 'Title, description, pricing, and deadline are required' });
    }

    // Validate deadline format
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(deadline);
    if (!isValidDate) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Create and save the job
    const newJob = new Job({ title, description, pricing, deadline, status });
    const job = await newJob.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error.message);
    res.status(500).json({ message: 'Failed to create job', error: error.message });
  }
};

// Update a job
exports.updateJob = async (req, res) => {
  try {
    const { title, description, pricing, deadline, status } = req.body;

    // Validate required fields
    if (!title || !description || !pricing || !deadline) {
      return res
        .status(400)
        .json({ error: 'Title, description, pricing, and deadline are required' });
    }

    // Validate deadline format
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(deadline);
    if (!isValidDate) {
      return res.status(400).json({ error: 'Invalid date format. Use YYYY-MM-DD.' });
    }

    // Update the job
    const job = await Job.findByIdAndUpdate(
      req.params.id,
      { title, description, pricing, deadline, status },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error('Error updating job:', error.message);
    res.status(500).json({ message: 'Failed to update job', error: error.message });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.status(200).json({ message: 'Job deleted successfully', job });
  } catch (error) {
    console.error('Error deleting job:', error.message);
    res.status(500).json({ message: 'Failed to delete job', error: error.message });
  }
};
