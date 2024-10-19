import React, { useEffect, useState } from 'react';
import './UserDetails.css';

const UserDetails = () => {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [upcomingFlights, setUpcomingFlights] = useState([]);
  const email = localStorage.getItem('email'); // Get the email from local storage

  useEffect(() => {
    // Fetch user data using email
    if (email) {
      fetch(`http://localhost:3000/user/${email}`)
        .then(response => response.json())
        .then(data => setUserData(data))
        .catch(error => console.error('Error fetching user data:', error));

      // Fetch user bookings
      fetch(`http://localhost:3000/user/user-bookings/${email}`)
        .then(response => response.json())
        .then(data => setBookings(data))
        .catch(error => console.error('Error fetching bookings:', error));

      // Fetch upcoming flights
      fetch(`http://localhost:3000/user/upcoming-flights/${email}`)
        .then(response => response.json())
        .then(data => setUpcomingFlights(data))
        .catch(error => console.error('Error fetching upcoming flights:', error));
    }
  }, [email]);

  if (!userData) {
    return <p>Loading user details...</p>;
  }

  return (
    <div className="user-details-container">
      {/* User Info Card */}
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
      </div> )

      {/* Recent Flight Bookings */}
  
      
      
  
};

export default UserDetails;
