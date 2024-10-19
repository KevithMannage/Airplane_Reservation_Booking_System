import React, { useState, useEffect } from 'react';
import './UserBookings.css'; // Import the CSS file

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email'); // Get email from localStorage
    if (email) {
      fetch(`http://localhost:3000/user/user-bookings/${email}`)
        .then((response) => response.json())
        .then((data) => setBookings(data))
        .catch((error) => console.error('Error fetching bookings:', error));
    }
  }, []);

  return (
    <div className="booking-container">
      {bookings.length > 0 ? (
        bookings.map((booking, index) => (
          <div key={index} className="booking-card">
            <h3>Flight Number: {booking.flight_number}</h3>
            <p><strong>From:</strong> {booking.from_destination}</p>
            <p><strong>To:</strong> {booking.to_destination}</p>
            <p><strong>Departure Time:</strong> {new Date(booking.departure_time).toLocaleString()}</p>
            <p><strong>Arrival Time:</strong> {new Date(booking.arrival_time).toLocaleString()}</p>
            <p><strong>Duration:</strong> {booking.duration}</p>
          </div>
        ))
      ) : (
        <p>No bookings available</p>
      )}
    </div>
  );
};

export default UserBookings;
