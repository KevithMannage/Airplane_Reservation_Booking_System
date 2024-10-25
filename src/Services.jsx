import React from 'react';
import './Services.css'; 

const Services = () => {
  return (
    <div className="services-page">
      <h1 className="services-title">Airplane Services</h1>
      <p className="services-description">
        Experience the best in comfort, entertainment, and connectivity with our wide range of services on board. 
        From premium seating to world-class entertainment, we have it all.
      </p>
      <div className="services-container">
        <div className="service-card first-class">
          <img src="/services1.jpg" alt="First Class Service" className="service-image" />
          <h2>First Class</h2>
          <p>Luxury seating, gourmet meals, and premium lounge access for an unparalleled flying experience.</p>
        </div>
        
        <div className="service-card in-flight-entertainment">
          <img src="/services2.jpg" alt="In-Flight Entertainment" className="service-image" />
          <h2>In-Flight Entertainment</h2>
          <p>Watch movies, TV shows, and enjoy interactive games on your personal entertainment screen.</p>
        </div>
        
        <div className="service-card baggage-handling">
          <img src="/services3.jpg" alt="Baggage Handling" className="service-image" />
          <h2>Baggage Handling</h2>
          <p>Safe and reliable handling of your luggage, with real-time tracking and priority baggage services.</p>
        </div>
        
         <div className="service-card meals">
          <img src="/services4.jpg" alt="In-Flight Meals" className="service-image" />
          <h2>In-Flight Meals</h2>
          <p>Choose from a variety of gourmet meals and snacks tailored to your dietary preferences.</p>
        </div>

        <div className="service-card duty-free-shopping">
          <img src="/services6.jpg" alt="Duty-Free Shopping" className="service-image" />
          <h2>Duty-Free Shopping</h2>
          <p>Shop for exclusive duty-free products while onboard, from luxury brands to local items.</p>
          </div>
        <div className="service-card seat-selection">
          <img src="/services5.jpg" alt="Seat Selection" className="service-image" />
          <h2>Seat Selection</h2>
          <p>Choose your preferred seat in advance to ensure a comfortable journey.</p>
        </div>

        <div className="service-card medical-assistance">
          <img src="/services7.jpg" alt="Onboard Medical Assistance" className="service-image" />
          <h2>Onboard Medical Assistance</h2>
          <p>We offer trained medical personnel and emergency care equipment for passenger safety.</p>
        </div>

        <div className="service-card travel-insurance">
          <img src="/services8.jpg" alt="Travel Insurance" className="service-image" />
          <h2>Travel Insurance</h2>
          <p>Get peace of mind with our comprehensive travel insurance plans covering unexpected events.</p>
        </div>

        <div className="service-card kids-entertainment">
          <img src="/services9.jpg" alt="Kids' Entertainment" className="service-image" />
          <h2>Kids' Entertainment</h2>
          <p>Special onboard entertainment for kids including movies, games, and activities to keep them engaged.</p>
        </div>



      </div>
    </div>
  );
};
  


export default Services;
