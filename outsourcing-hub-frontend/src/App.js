import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import RegisterPage from './pages/RegisterPage';
import LandingPage from './pages/LandingPage';
import './styles/App.css';

const App = () => {
  const [user, setUser] = useState(null); // State to track logged-in user

  // Rehydrate user state on app load
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      fetch('http://localhost:5000/api/auth/validate-token', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            setUser(data.user); // Update user state with validated user
          } else {
            localStorage.removeItem('authToken'); // Remove invalid token
          }
        })
        .catch(() => {
          localStorage.removeItem('authToken'); // Handle validation failure
        });
    }
  }, []);

  return (
    <Router>
      <div className="app">
        {/* Pass user and setUser to Navbar */}
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/dashboard"
            element={user ? <Dashboard /> : <LoginPage setUser={setUser} />} // Protect Dashboard route
          />
          <Route
            path="/login"
            element={<LoginPage setUser={setUser} />} // Pass setUser to LoginPage
          />
          <Route
            path="/register"
            element={<RegisterPage />} 
          />
          <Route
            path="/admin"
            element={<AdminDashboard /> } // Admin protected route
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
