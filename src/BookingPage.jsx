import React, { useState } from 'react';
import FlightDetails from './FlightDetails';
import BookAndSearchFlight from './Bookingpage2';
import './booking.css';
import bookingImage from '/airplanes.jpg';
import { useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [flightDetails, setFlightDetails] = useState(null);
  const [ticketType, setTicketType] = useState('Economy');
  const navigate = useNavigate();

  const handleSeatSelect = (seat) => {
    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleFlightDetails = (details) => {
    setFlightDetails(details);
  };

  const handleProceed = () => {
    if (!flightDetails || selectedSeats.length === 0) {
      console.error('Please select a flight and seats before proceeding.');
      return;
    }

    navigate('/submit-details', {
      state: {
        flightDetails: flightDetails,
        selectedSeats: selectedSeats, 
        ticketType: ticketType,
      },
    });
  };

  return (
    <div className="booking-page">
      <div className="container">
        <div className="image-container">
          <h1>Welcome to Flight Booking</h1>
          <img src={bookingImage} alt="Booking" className="booking-image" />
        </div>

        <BookAndSearchFlight onFlightDetails={handleFlightDetails} onSeatSelect={handleSeatSelect} />

        {flightDetails && <FlightDetails details={flightDetails} />}

       
      </div>
    </div>
  );
};

export default BookingPage;