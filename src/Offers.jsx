import React from 'react';
import './Offers.css'; 
import Navbar from './Navbar';

const Offers = () => {
    return (
        <div className="offers-background">
            <div className="offers-container">
                <h1>Special Offers</h1>
                <div className="offers-grid">
                    <div className="offer-card">
                        <h2>Flight Deal to Paris</h2>
                        <img src="offers1.jpg" alt="Offer 1" />
                        <p>Get 20% off on flights to Paris this summer. Limited time offer!</p>
                    </div>
                    <div className="offer-card">
                        <h2>Discounted Hotel Stays</h2>
                        <img src="offers2.jpg" alt="Offer 2" />
                        <p>Enjoy up to 30% off on hotel stays in New York. Book your stay today!</p>
                    </div>
                    <div className="offer-card">
                        <h2>Family Package to Tokyo</h2>
                        <img src="offers3.jpg" alt="Offer 3" />
                        <p>Special family package with free tickets for kids under 12.</p>
                    </div>
                    <div className="offer-card">
                        <h2>Weekend Getaway to Miami</h2>
                        <img src="offers4.jpg" alt="Offer 4" />
                        <p>Book a weekend in Miami and enjoy a 15% discount on all activities!</p>
                    </div>
                                        <div className="offer-card">
                        <h2>Family Fun in Orlando</h2>
                        <img src="offers8.jpg" alt="Offer 8" />
                        <p>Save 20% on family tickets to theme parks in Orlando. Book now!</p>
                    </div>

                    
                    <div className="offer-card">
                        <h2>Adventure Trip to Costa Rica</h2>
                        <img src="offers6.jpg" alt="Offer 6" />
                        <p>Join us for an adventure trip to Costa Rica and get 10% off for groups!</p>
                    </div>
                    <div className="offer-card">
                        <h2>Romantic Escape to Santorini</h2>
                        <img src="offers7.jpg" alt="Offer 7" />
                        <p>Enjoy a romantic escape to Santorini with a complimentary dinner!</p>
                    </div>
                    <div className="offer-card">
                        <h2>Luxury Cruise to the Bahamas</h2>
                        <img src="offers5.jpg" alt="Offer 5" />
                        <p>Experience the Bahamas on a luxury cruise with 25% off your booking!</p>
                    </div>
                    
                    <div className="offer-card">
                        <h2>Beach Resort in the Maldives</h2>
                        <img src="offers9.jpg" alt="Offer 12" />
                        <p>Relax at a luxury beach resort in the Maldives with up to 40% off!</p>
                        </div>
                </div>
            </div>
        </div>
    );
};

export default Offers;
