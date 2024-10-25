import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [backgroundIndex, setBackgroundIndex] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false); 

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

  
    const backgroundImages = [
        'url(1.jpg)',
        'url(2.jpg)',
        'url(3.jpg)',
    ];

  
    useEffect(() => {
        const interval = setInterval(() => {
            setBackgroundIndex((prevIndex) => (prevIndex + 1) % backgroundImages.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [backgroundImages.length]);

   
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        setIsLoggedIn(loggedInStatus === 'true');
    }, []);

    return (
        <div className="background-container" style={{ backgroundImage: backgroundImages[backgroundIndex] }}>
            <nav className="navbar">
                <div className="navbar-logo">
                    Airline Logo
                    <img src="/b_.png" alt="Airline Logo" /> 
                </div>

                <ul className="navbar-links">

                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/flights">Flights</Link></li>
                    <li><Link to="/services">Services</Link></li> 
                    <li><Link to="/offers">Offers</Link></li> 
                    <li><Link to="/contact">Contact Us</Link></li>
                    <li><Link to="/airplanes">Airplanes</Link></li>
                    <li><Link to="/customer/ViewFlights">Booking</Link></li>
                    {isLoggedIn ? (
                        <li><Link to="/dashboard" className="btn-dashboard">Dashboard</Link></li>
                    ) : (
                        <li><Link to="/login" className="btn-login">Login</Link></li>
                    )}
                </ul>
                <div className="navbar-search">
                </div>
            </nav>
        </div>
    );
};

export default Navbar;
