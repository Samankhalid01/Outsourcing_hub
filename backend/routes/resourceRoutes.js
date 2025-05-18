const express = require('express');
const router = express.Router();
const Resource = require('../models/Resource'); // Adjust the path if needed

// GET /api/resource - Fetch all resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error.message);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

// POST /api/resource - Create a new resource
router.post('/', async (req, res) => {
  try {
    console.log('Incoming Request Body:', req.body);

    const { title, type, description, pricing, deadline, status } = req.body;

    // Validate required fields
    if (!title || !type || !description || !pricing || !deadline) {
      return res
        .status(400)
        .json({ error: 'Title, type, description, pricing, and deadline are required' });
    }

    // Validate pricing to ensure it is a number greater than zero
    if (typeof pricing !== 'number' || pricing <= 0) {
      return res.status(400).json({ error: 'Pricing must be a number greater than zero' });
    }

    // Validate deadline format (DD-MM-YYYY)
    const isValidDate = /^\d{2}-\d{2}-\d{4}$/.test(deadline);
    if (!isValidDate) {
      return res.status(400).json({ error: 'Invalid deadline format. Use DD-MM-YYYY.' });
    }

    // Create a new resource with the provided fields
    const newResource = new Resource({ title, type, description, pricing, deadline, status });
    const savedResource = await newResource.save();

    console.log('Resource Created:', savedResource);
    res.status(201).json(savedResource);
  } catch (error) {
    console.error('Error in POST /api/resource:', error.message);
    res.status(500).json({ error: 'Failed to create resource' });
  }
});

// PUT /api/resource/:id - Update a resource by ID
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { deadline, type } = req.body;

    // Validate deadline format if provided
    if (deadline) {
      const isValidDate = /^\d{2}-\d{2}-\d{4}$/.test(deadline);
      if (!isValidDate) {
        return res.status(400).json({ error: 'Invalid deadline format. Use DD-MM-YYYY.' });
      }
    }

    // Validate type if provided
    if (type && typeof type !== 'string') {
      return res.status(400).json({ error: 'Type must be a valid string.' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.status(200).json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error.message);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// DELETE /api/resource/:id - Delete a resource by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedResource = await Resource.findByIdAndDelete(id);
    if (!deletedResource) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    console.log('Resource Deleted:', deletedResource);
    res.status(200).json({ message: 'Resource deleted successfully', deletedResource });
  } catch (error) {
    console.error('Error in DELETE /api/resource/:id:', error.message);
    res.status(500).json({ error: 'Failed to delete resource' });
  }
});

// __________________________________________
router.delete('/', async (req, res) => {
  try {
    const result = await Resource.deleteMany(); 
    console.log('All resources deleted:', result);
    res.status(200).json({ message: 'All resources have been deleted successfully.' });
  } catch (error) {
    console.error('Error in DELETE /api/resource:', error.message);
    res.status(500).json({ error: 'Failed to delete all resources' });
  }
});

// Export the router
module.exports = router;
