import React, { useState } from 'react';
import FlightDetails from './FlightDetails';
import PassengerInfo from './PassengerInfo';
import BookAndSearchFlight from './Bookingpage2'; // Import BookAndSearchFlight
import './booking.css';
import bookingImage from '/airplanes.jpg'; // Import your image here
import Bookingpage2 from './Bookingpage2';
import SeatSelection from './SeatSelection'; // Import SeatSelection

const BookingPage = () => {
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [flightDetails, setFlightDetails] = useState(null); // Flight details from search results
  const [aircraftDetails, setAircraftDetails] = useState(null); // Aircraft details

  const handleSeatSelect = (seat) => {
    setSelectedSeats([...selectedSeats, seat]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle booking submission
    console.log("Booking submitted");
    console.log("Selected Seats: ", selectedSeats);
  };

  const handleFlightDetails = (details) => {
    setFlightDetails(details); // Set flight details after a successful search
  };

  const handleAircraftDetails = (details) => {
    setAircraftDetails(details); // Set aircraft details after a successful search
  };

  return (
    <div className="booking-page">
      <div className="container">
        {/* Image at the top of the booking page */}
        <div className="image-container">
          <h1>Welcome to Flight Booking</h1>
          <img src={bookingImage} alt="Booking" className="booking-image" />
        </div>

        {/* Book and Search Flights section */}
        <BookAndSearchFlight onFlightDetails={handleFlightDetails} /> {/* Pass the flight details handler */}

        {/* Display flight and aircraft details if available */}
        {flightDetails && <FlightDetails details={flightDetails} />}

        {aircraftDetails && (
          <div className="aircraft-details">
            <h3>Aircraft Details</h3>
            <p><strong>Aircraft Type:</strong> {aircraftDetails.type}</p>
            <p><strong>Aircraft Capacity:</strong> {aircraftDetails.capacity}</p>
          </div>
        )}

        {/* General Information Section */}
        <div className="form-section">
          <div className="general-info">
            <h3>General Information</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Full Name" required />
              <input type="text" placeholder="Address" required />
              <input type="text" placeholder="State" required />
              <input type="text" placeholder="Country" required />
              <input type="email" placeholder="Email" required />
              <select required>
                <option value="">No. of Passengers</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
              </select>
            </form>
          </div>
        </div>

        {/* Seat selection and passenger information */}
        
        <PassengerInfo />
      </div>
    </div>
  );
};

export default BookingPage;
