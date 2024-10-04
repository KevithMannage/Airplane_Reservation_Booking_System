import React from 'react';
import FlightsSearch from './FlightsSearch';
import Offers from './Offers';
import Navbar from './Navbar';
import './HomePage.css';
import ImageSwitcher from './ImageSwitcher.jsx';
const HomePage = () => (
    <div className="homepage">
        <ImageSwitcher/>

        <div className="hero-section">
            <h1>Welcome to Our Airline</h1>
        </div>
   
    </div>
);

export default HomePage;