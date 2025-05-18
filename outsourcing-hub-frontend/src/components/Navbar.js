import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/components/Navbar.css';

const Navbar = ({ user, setUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Manage account dropdown state
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false); // Close the menu when a link is clicked
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen); // Toggle the account dropdown
  };

  const handleLogout = () => {
    // Clear user state, remove token, and navigate to the login page
    setUser(null);
    localStorage.removeItem('authToken'); // Optional: Remove token from storage
    navigate('/'); // Redirect to home
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={closeMenu}>Outsourcing Hub</Link>
      </div>
      <button
        className="navbar-toggle"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        {isOpen ? '✖' : '☰'}
      </button>
      <ul className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <li>
          <Link to="/" onClick={closeMenu}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={closeMenu}>
            Dashboard
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link to="/login" onClick={closeMenu}>
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" onClick={closeMenu}>
                Register
              </Link>
            </li>
          </>
        ) : (
          <li className="account-dropdown">
            <div
              onClick={toggleDropdown}
              className="account-icon"
              aria-label="Account menu"
            >
              👤 {user.name}
            </div>
            {dropdownOpen && (
              <div className="dropdown-menu">
                <p>
                  <strong>{user.name}</strong>
                </p>
                <p>{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            )}
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;


