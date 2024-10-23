import React, { useEffect, useState } from 'react';
import './UserDetails.css';

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const email = localStorage.getItem('email');


  useEffect(() => {
    // Fetch user data using email
    if (email) {
      fetch(`http://localhost:3000/user/${email}`)
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));
    }
  }, [email]);

  if (!userData) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="user-details-container">
    <div className="user-card">
      <h2 style={{ textAlign: 'center', margin: '0' }}>{userData.full_name}</h2>
      <p><strong>Email:</strong> {userData.email}</p>
      <p><strong>Gender:</strong> {userData.gender}</p>
      <p><strong>Date of Birth:</strong> {userData.dob}</p>
      <p><strong>Passport Number:</strong> {userData.passport_number}</p>
      <p><strong>Mobile Number:</strong> {userData.mobile_num}</p>
      <p><strong>Flight Count:</strong> {userData.flight_count}</p>
      <p><strong>Tier:</strong> {userData.tier}</p>
      <p><strong>Frequent Flyer Miles:</strong> {userData.frequent_flyer_miles} miles</p>
    </div>
  </div>
);

  
      
      
  
};

export default UserDetails;
/*

import React, { useEffect, useState } from 'react';
import './UserDetails.css';

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const email = localStorage.getItem('email');
  const token = localStorage.getItem('token'); // Get token from localStorage

  useEffect(() => {
    if (email && token) {
      // Fetch user data
      fetch(`http://localhost:3000/user/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch user data');
          }
          return response.json();
        })
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));

      // Fetch user bookings
      fetch(`http://localhost:3000/user/user-bookings/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch bookings');
          }
          return response.json();
        })
        .then(data => setBookings(data))
        .catch(error => console.error('Error fetching bookings:', error));

      // Fetch upcoming flights
      fetch(`http://localhost:3000/user/upcoming-flights/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in headers
        },
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to fetch upcoming flights');
          }
          return response.json();
        })
        .then(data => setUpcomingFlights(data))
        .catch(error => console.error('Error fetching upcoming flights:', error));
    }
  }, [email, token]);

  if (!userData) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="user-details-container">
      <div className="user-card">
        <h2>{userData.full_name}</h2>
        <p><strong>Email:</strong> {userData.email}</p>
        <p><strong>Gender:</strong> {userData.gender}</p>
        <p><strong>Date of Birth:</strong> {userData.dob}</p>
        <p><strong>Passport Number:</strong> {userData.passport_number}</p>
        <p><strong>Mobile Number:</strong> {userData.mobile_num}</p>
        <p><strong>Flight Count:</strong> {userData.flight_count}</p>
        <p><strong>Tier:</strong> {userData.tier}</p>
        <p><strong>Frequent Flyer Miles:</strong> {userData.frequent_flyer_miles} miles</p>
      </div>

      <div className="bookings">
        <h3>User Bookings</h3>
        {bookings.length > 0 ? (
          <ul>
            {bookings.map((booking, index) => (
              <li key={index}>
                <p>Flight: {booking.flight_id}</p>
                <p>Date: {booking.flight_date}</p>
                <p>Seat: {booking.seat_number}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No bookings available</p>
        )}
      </div>

      <div className="upcoming-flights">
        <h3>Upcoming Flights</h3>
        {upcomingFlights.length > 0 ? (
          <ul>
            {upcomingFlights.map((flight, index) => (
              <li key={index}>
                <p>Flight ID: {flight.flight_id}</p>
                <p>Departure: {flight.departure_time}</p>
                <p>Arrival: {flight.arrival_time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming flights available</p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
*/