import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for navigation
import './Footer.css'; // Import the CSS file

const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="container">
        <div className="footer-content">
          {/* Company Section */}
          <div className="footer-widget widget-menu">
            <h3 className="widget-title">Company</h3>
            <ul>
              <li>
                <Link to="/about">
                  <i className="fas fa-angle-double-right"></i> About
                </Link>
              </li>
              <li>
                <Link to="/customer/ViewFlights">
                  <i className="fas fa-angle-double-right"></i> Booking
                </Link>
              </li>
              <li>
                <Link to="/contact">
                  <i className="fas fa-angle-double-right"></i> Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="footer-widget widget-menu">
            <h3 className="widget-title">Legal</h3>
            <ul>
              <li>
                <Link to="/terms-and-conditions">
                  <i className="fas fa-angle-double-right"></i> Terms & Conditions
                </Link>
              </li>
             
            </ul>
          </div>

          {/* About Us Section */}
          <div className="footer-widget widget-about-us">
            <h3 className="widget-title">About Us</h3>
            <p>
              We are B Airways, a subsidiary of Virgin Airlines. Some people just know how to fly.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Area */}
      <div className="privacy-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <p>Copyright © DBMS 2024. All rights reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
