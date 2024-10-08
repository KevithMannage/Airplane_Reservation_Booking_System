// src/components/Dashboard.jsx
import React from 'react';
import './Dashboard.css'; // Optional: Import a CSS file for styling if needed

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <h1>Welcome to your Dashboard</h1>
            <p>You are successfully logged in!</p>
            {/* You can add more content here like user stats, flight details, etc. */}
        </div>
    );
};

export default Dashboard;
