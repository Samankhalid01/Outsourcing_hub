import React, { useState } from 'react';
import '../styles/pages/JobListings.css'; // Link the CSS file for styling

const JobListings = ({ jobs }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    whatsapp: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');

  // Handle "Apply Now" button click
  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setShowForm(true);
    setSuccessMessage('');
    setError('');
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: selectedJob._id,
          email: formData.email,
          whatsapp: formData.whatsapp,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit application');
      }

      setSuccessMessage('Application submitted successfully!');
      setFormData({ email: '', whatsapp: '' });
      setShowForm(false);
    } catch (err) {
      console.error('Error submitting application:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="job-listings">
      <h2>Available Jobs</h2>

      {jobs.length > 0 ? (
        <ul className="job-listings">
          {jobs.map((job) => (
            <li key={job._id} className="job-card">
              <h3>{job.title}</h3>
              <p>{job.description}</p>
              <p><strong>Budget:</strong> ${job.pricing}</p> {/* Display pricing */}
              <p>
                <strong>Deadline:</strong>{' '}
                {job.deadline ? job.deadline : 'N/A'} {/* Display deadline as string */}
              </p>
              <p><strong>Status:</strong> {job.status}</p>
              <button className="apply-button" onClick={() => handleApplyClick(job)}>
                Apply Now
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No jobs available at the moment.</p>
      )}

      {showForm && (
        <div className="application-form-modal">
          <div className="application-form">
            <h3>Apply for Job: {selectedJob.title}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="whatsapp">WhatsApp Number</label>
                <input
                  type="text"
                  id="whatsapp"
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <button type="submit" className="submit-button">
                Submit Application
              </button>
              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </form>
            {successMessage && <p className="success-message">{successMessage}</p>}
            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListings;
