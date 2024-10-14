// src/components/Navbar.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // State to check if user is logged in

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    // Array of background images from the public directory
    const backgroundImages = [
        'url(1.jpg)',
        'url(2.jpg)',
        'url(3.jpg)',
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 3000); // 30 seconds

        return () => clearInterval(interval);
    }, [backgroundImages.length]);

    useEffect(() => {
        // Check if the user is logged in
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
    }, []);

    return (
        <div className="background-container" style={{ backgroundImage: backgroundImages[backgroundIndex] }}>
            <nav className="navbar">
                <div className="navbar-logo">
                    Airline Logo
                    <img src="/b_.png" alt="Airline Logo" /> {/* Add your airline logo image here */}
                </div>

                <ul className="navbar-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/flights">Flights</Link></li>
                    <li><Link to="/Services">Services</Link></li> {/* Link to Services page */}
                    <li><Link to="/offers">Offers</Link></li> {/* Link to Offers page */}
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/Airplanes">Airplanes</Link></li>
                    {/* Change Login link to Dashboard link if user is logged in */}
                    {isLoggedIn ? (
                        <li><Link to="/dashboard" className="btn-dashboard">Dashboard</Link></li>
                    ) : (
                        <li><Link to="/login" className="btn-login">Login</Link></li>
                    )}
                </ul>
                <div className="navbar-search">
                    <input type="text" placeholder="Search..." />
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
