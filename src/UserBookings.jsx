
import React, { useState, useEffect } from 'react';
import './UserBookings.css'; 

const UserBookings = () => {
  const [pastBookings, setPastBookings] = useState([]);
  const [ongoingBookings, setOngoingBookings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token'); 
    if (email) {
      fetch(`http://localhost:3000/user/user-bookings/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          const currentDate = new Date();
          const past = data.filter(booking => new Date(booking.arrival_time) < currentDate);
          const ongoing = data.filter(booking => new Date(booking.arrival_time) >= currentDate);
          
          setPastBookings(past);
          setOngoingBookings(ongoing);
        })
        .catch((error) => console.error('Error fetching bookings:', error));
    }
  }, []);

  return (
    <div className="booking-container">
      <div className="booking-card">
      <h2>Ongoing Bookings</h2>
      </div>
      {ongoingBookings.length > 0 ? (
        ongoingBookings.map((booking, index) => (
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
        <div className="booking-card no-booking-message">
          <h3>No Ongoing Flights Available</h3>
        </div>
      )}

      <div style={{ padding: '20px 0' }}></div>
      <div className="booking-card2">
      <div className="booking-card">
      <h2>Past Bookings</h2>
      </div>
      </div>
      {pastBookings.length > 0 ? (
        pastBookings.map((booking, index) => (
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
        <div className="no-booking-message">No past bookings available</div>
      )}
    </div>
  );
};

export default UserBookings;
