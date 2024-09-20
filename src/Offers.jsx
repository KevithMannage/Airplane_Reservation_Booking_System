import React from 'react';
import './Offers.css'; // Import CSS for styling
import Navbar from './Navbar';

const Offers = () => {
 

    return (
        <div 
            className="offers-background">
            <div className="offers-container">
                <h1>Special Offers</h1>
                <div className="offers-grid">
                    <div className="offer-card">
                        <h2>Flight Deal to Paris</h2>
                        <img src="offers1.jpg" alt="Offer 1" />
                        <p>Get 20% off on flights to Paris this summer. Limited time offer!</p>
                        <a href="/book-now" className="btn">Book Now</a>
                    </div>
                    <div className="offer-card">
                        <h2>Discounted Hotel Stays</h2>
                        <img src="offers2.jpg" alt="Offer 2" />
                        <p>Enjoy up to 30% off on hotel stays in New York. Book your stay today!</p>
                        <a href="/book-now" className="btn">Book Now</a>
                    </div>
                    <div className="offer-card">
                        <h2>Family Package to Tokyo</h2>
                        <img src="offers3.jpg" alt="Offer 3" />
                        <p>Special family package to Tokyo with free tickets for kids under 12.</p>
                        <a href="/book-now" className="btn">Book Now</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;
