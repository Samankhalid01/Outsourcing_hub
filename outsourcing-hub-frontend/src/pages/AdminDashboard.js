import React, { useState, useEffect } from 'react';
import '../styles/pages/AdminDashboard.css';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [newJob, setNewJob] = useState({
    title: '',
    type: '',
    description: '',
    pricing: '',
    deadline: '', // Deadline as string
    status: 'active',
  });
  const [editingJob, setEditingJob] = useState(null); // Store the job being edited
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Success message state

  // Fetch jobs and applications from the backend
  useEffect(() => {
    const fetchJobsAndApplications = async () => {
      try {
        const jobsResponse = await fetch('/api/resource');
        if (!jobsResponse.ok) {
          throw new Error(`Failed to fetch jobs: ${jobsResponse.status} ${jobsResponse.statusText}`);
        }
        const jobsData = await jobsResponse.json();
        setJobs(jobsData);

        const applicationsResponse = await fetch('/api/applications');
        if (!applicationsResponse.ok) {
          throw new Error(`Failed to fetch applications: ${applicationsResponse.status} ${applicationsResponse.statusText}`);
        }
        const applicationsData = await applicationsResponse.json();
        setApplications(applicationsData);
      } catch (err) {
        console.error('Error fetching data:', err.message);
        setError(err.message);
      }
    };

    fetchJobsAndApplications();
  }, []);

  // Handle new job submission
  const handleNewJobSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/resource', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newJob),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create job: ${response.status} ${response.statusText}`);
      }

      const createdJob = await response.json();
      setJobs((prevJobs) => [...prevJobs, createdJob]);
      setNewJob({ title: '', type: '', description: '', pricing: '', deadline: '', status: 'active' }); // Reset form
      setSuccessMessage('Job created successfully.');
    } catch (err) {
      console.error('Error creating job:', err.message);
      setError(err.message);
    }
  };

  // Handle job editing
  const handleEditJob = (job) => {
    setEditingJob({ ...job }); // Populate the editing form with job details
  };

  const handleUpdateJob = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`/api/resource/${editingJob._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingJob),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to update job: ${response.status} ${response.statusText}`);
      }

      const updatedJob = await response.json();

      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === updatedJob._id ? updatedJob : job))
      );

      setEditingJob(null); // Close the editing modal
      setSuccessMessage('Job updated successfully.');
    } catch (err) {
      console.error('Error updating job:', err.message);
      setError(err.message);
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch(`/api/resource/${jobId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete job: ${response.status} ${response.statusText}`);
      }

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId));
      setSuccessMessage('Job deleted successfully.');
    } catch (err) {
      console.error('Error deleting job:', err.message);
      setError(err.message);
    }
  };

  // Handle delete all jobs
  const handleDeleteAllJobs = async () => {
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch('/api/resource', {
        method: 'DELETE', // Assuming DELETE /api/resource deletes all jobs
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to delete all jobs: ${response.status} ${response.statusText}`);
      }

      setJobs([]); // Clear the jobs from state
      setSuccessMessage('All jobs have been deleted successfully.');
    } catch (err) {
      console.error('Error deleting all jobs:', err.message);
      setError(err.message);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Manage jobs and view user applications here.</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      </header>

      {/* Job Creation Section */}
      <section className="job-creation">
        <h2>Create New Job</h2>
        <form onSubmit={handleNewJobSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              required
            />
          </label>
          <label>
            Type:
            <input
              type="text"
              value={newJob.type}
              onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
              required
            />
          </label>
          <label>
            Description:
            <textarea
              value={newJob.description}
              onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
              required
            ></textarea>
          </label>
          <label>
            Pricing:
            <input
              type="number"
              value={newJob.pricing}
              onChange={(e) => setNewJob({ ...newJob, pricing: Number(e.target.value) })}
              required
            />
          </label>
          <label>
            Deadline:
            <input
              type="text"
              placeholder="e.g., 15-01-2024"
              value={newJob.deadline}
              onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
              required
            />
          </label>
          <label>
            Status:
            <select
              value={newJob.status}
              onChange={(e) => setNewJob({ ...newJob, status: e.target.value })}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
            </select>
          </label>
          <button type="submit">Create Job</button>
        </form>
      </section>

      {/* Job Management Section */}
      <section className="job-management">
        <h2>Manage Jobs</h2>
        <button
          onClick={handleDeleteAllJobs}
          style={{
            backgroundColor: 'red',
            color: 'white',
            padding: '10px 20px',
            marginBottom: '20px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Delete All Jobs
        </button>
        <table className="job-table">
          <thead>
            <tr>
              <th>Job ID</th>
              <th>Title</th>
              <th>Type</th>
              <th>Description</th>
              <th>Pricing</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job._id}>
                <td>{job._id}</td>
                <td>{job.title}</td>
                <td>{job.type}</td>
                <td>{job.description}</td>
                <td>${job.pricing}</td>
                <td>{job.deadline || 'N/A'}</td> {/* Display deadline */}
                <td>{job.status}</td>
                <td>
                  <button onClick={() => handleEditJob(job)}>Edit</button>
                  <button onClick={() => handleDeleteJob(job._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Edit Job Modal */}
      {editingJob && (
        <div className="edit-modal">
          <form onSubmit={handleUpdateJob}>
            <h3>Edit Job</h3>
            <label>
              Title:
              <input
                type="text"
                value={editingJob.title}
                onChange={(e) => setEditingJob({ ...editingJob, title: e.target.value })}
                required
              />
            </label>
            <label>
              Type:
              <input
                type="text"
                value={editingJob.type}
                onChange={(e) => setEditingJob({ ...editingJob, type: e.target.value })}
                required
              />
            </label>
            <label>
              Description:
              <textarea
                value={editingJob.description}
                onChange={(e) => setEditingJob({ ...editingJob, description: e.target.value })}
                required
              ></textarea>
            </label>
            <label>
              Pricing:
              <input
                type="number"
                value={editingJob.pricing}
                onChange={(e) => setEditingJob({ ...editingJob, pricing: Number(e.target.value) })}
                required
              />
            </label>
            <label>
              Deadline:
              <input
                type="text"
                placeholder="e.g., 15-01-2024"
                value={editingJob.deadline}
                onChange={(e) => setEditingJob({ ...editingJob, deadline: e.target.value })}
                required
              />
            </label>
            <label>
              Status:
              <select
                value={editingJob.status}
                onChange={(e) => setEditingJob({ ...editingJob, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
              </select>
            </label>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingJob(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Applications Management Section */}
      <section className="applications-management">
        <h2>User Applications</h2>
        <table className="applications-table">
          <thead>
            <tr>
              <th>Application ID</th>
              <th>Job ID</th>
              <th>User Email</th>
              <th>WhatsApp</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((application) => (
              <tr key={application._id}>
                <td>{application._id}</td>
                <td>{application.jobId}</td>
                <td>{application.email}</td>
                <td>{application.whatsapp}</td>
                <td>{application.appliedAt || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
