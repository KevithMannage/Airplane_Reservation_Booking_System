/*import React, { useState, useEffect } from 'react';
import './UserBookings.css'; // Import the CSS file

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
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
*/

/*import React, { useState, useEffect } from 'react';
import './UserBookings.css'; // Import the CSS file

const UserBookings = () => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (email) {
      fetch(`http://localhost:3000/user/user-bookings/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
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
*/
import React, { useState, useEffect } from 'react';
import './UserBookings.css'; // Import the CSS file

const UserBookings = () => {
  const [pastBookings, setPastBookings] = useState([]);
  const [ongoingBookings, setOngoingBookings] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem('email');
    const token = localStorage.getItem('token'); // Get the token from local storage
    if (email) {
      fetch(`http://localhost:3000/user/user-bookings/${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // Add the token to the Authorization header
        }
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          // Split bookings into past and ongoing
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
      {/* Ongoing Bookings Section */}
      <h2>Ongoing Bookings</h2>
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

      {/* Padding to separate sections */}
      <div style={{ padding: '20px 0' }}></div>

      {/* Past Bookings Section */}
      <h2>Past Bookings</h2>
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
