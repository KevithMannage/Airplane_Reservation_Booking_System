import React, { useState } from 'react';
import FlightDetails from './FlightDetails';
import SeatSelection from './SeatSelection';
import PassengerInfo from './PassengerInfo';
import './booking.css';
import bookingImage from '/airplanes.jpg'; // Import your image here

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  
  const handleSeatSelect = (seat) => {
    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log("Booking submitted");
  };

  return (
    <div className="booking-page">
      <div className="container">
        {/* Image at the top of the booking page */}
        <div className="image-container">
        <h1> Welcome to Flight Booking</h1>
          <img src={bookingImage} alt="Booking" className="booking-image" />
          
        </div>
        
        <h2>Booking Flight</h2>
        
        <div className="form-section">
          <div className="general-info">
            <h3>General Information</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required />
              <input type="text" placeholder="Address" />
              <input type="text" placeholder="Mobile" />
              <input type="email" placeholder="Email" required />
              <select>
                <option>No. of Passengers</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </form>
          </div>
          <FlightDetails />
        </div>
        
        <SeatSelection onSeatSelect={handleSeatSelect} />
        
        <PassengerInfo />

        <button className="btn-create-booking" onClick={handleSubmit}>
          Create Booking
        </button>
      </div>
    </div>
  );
};

export default BookingPage;
