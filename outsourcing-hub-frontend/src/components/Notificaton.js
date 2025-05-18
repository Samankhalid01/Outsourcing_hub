import React, { useState } from 'react';
import '../styles/components/Notification.css';

const Notification = ({ message, type = "info", onClose }) => {
  return (
    <div className={`notification notification-${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>&times;</button>
    </div>
  );
};

export const NotificationDemo = () => {
  const [showNotification, setShowNotification] = useState(false);

  const handleShowNotification = () => setShowNotification(true);
  const handleCloseNotification = () => setShowNotification(false);

  return (
    <div>
      <button className="demo-btn" onClick={handleShowNotification}>
        Show Notification
      </button>
      {showNotification && (
        <Notification
          message="This is a sample notification!"
          type="success"
          onClose={handleCloseNotification}
        />
      )}
    </div>
  );
};

export default Notification;
