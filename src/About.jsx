// src/components/About.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './About.css'; // Import the CSS for styling
import WhyWeAreBest from './WhyWeAreBest';

const About = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  // Function to handle navigation when button is clicked
  const handleBookNowClick = () => {
    navigate('/customer/ViewFlights'); // Navigate to the booking page
  };

  return (
    <div className="about-page">
      {/* Top Info Bar */}
      <div className="about-info-bar">
        <div className="info-item">
          <span role="img" aria-label="Clock">🕒</span>
          <p>Working Hours<br /><strong>24/7 Hours</strong></p>
        </div>
        <div className="info-item">
          <span role="img" aria-label="Location">📍</span>
          <p>Location<br /><strong>Melbourne, Victoria, Australia</strong></p>
        </div>
        <div className="info-item">
          <span role="img" aria-label="Email">📧</span>
          <p>Email Address<br /><strong>info@bairways.com</strong></p>
        </div>
        <button className="book-now-button" onClick={handleBookNowClick}>BOOK NOW</button>
      </div>

      {/* Header with background image */}
      <div className="about-header">
        <img src="/8.jpg" alt="Airport Background" className="header-image" />
        <div className="header-text">
          <h1>About Us</h1>
          <p>Home - About Us</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="about-content">
        <div className="content-card">
          <div className="icon-circle">🔍</div>
          <h3>Fast & Easy Booking</h3>
          <p>Search for a flight, pick the seats as you wish, complete the payment. It’s that easy!</p>
        </div>
        <div className="content-card">
          <div className="icon-circle">🌍</div>
          <h3>Any Time Any Where</h3>
          <p>Taking you to destinations all around the globe every day. We’re Going Places!</p>
        </div>
        <div className="content-card">
          <div className="icon-circle">🕑</div>
          <h3>24/7 Support</h3>
          <p>24/7 online support for your questions and concerns. More than just flying!</p>
        </div>
      </div>
      <WhyWeAreBest/>
    </div>
  );
};

export default About;
