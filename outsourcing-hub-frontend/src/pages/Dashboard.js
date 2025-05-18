import React, { useEffect, useState } from 'react';
import '../styles/pages/Dashboard.css'; // Link the CSS file for styling
import JobListings from './JobListings'; // Import JobListings component

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
  });

  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/resource'); // Use your backend endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }
        const data = await response.json();
        setJobs(data);

        // Calculate stats
        const totalJobs = data.length;
        const activeJobs = data.filter((job) => job.status === 'pending').length;
        const completedJobs = data.filter((job) => job.status === 'completed').length;

        setStats({ totalJobs, activeJobs, completedJobs });
      } catch (error) {
        console.error('Error fetching jobs:', error.message);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Welcome to Your Dashboard</h1>
        <p>Track your performance, manage jobs, and monitor progress.</p>
      </header>

      <main className="dashboard-content">
        {/* Statistics Section */}
        <section className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-icon">📋</div>
            <h3>Total Jobs</h3>
            <p>{stats.totalJobs}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛠️</div>
            <h3>Active Jobs</h3>
            <p>{stats.activeJobs}</p>
          </div>
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <h3>Completed Jobs</h3>
            <p>{stats.completedJobs}</p>
          </div>
        </section>

        {/* Recent Activity Section */}
        <section className="dashboard-recent">
          <h2>Recent Activity</h2>
          <ul className="activity-list">
            {jobs.slice(0, 5).map((job, index) => (
              <li key={index}>
                Job "{job.title}" is {job.status}.
              </li>
            ))}
          </ul>
        </section>

        {/* Job Listings Integration */}
        <section className="dashboard-jobs">
          <h2>Job Listings</h2>
          <JobListings jobs={jobs} /> {/* Pass jobs as props */}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
