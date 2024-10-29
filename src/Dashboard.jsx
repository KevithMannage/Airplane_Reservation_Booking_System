
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import UserDetails from './UserDetails';

const Sidebar = ({ onLogout, onNavigate }) => (
    <div className="sidebar">
        <h2>Booking</h2>
        <ul>
    <li onClick={() => onNavigate('/')}><span role="img" aria-label="home">🏠</span> Home</li>
    <li onClick={() => onNavigate('/bookings')}><span role="img" aria-label="bookings">📅</span> Bookings</li>
    <li onClick={() => onNavigate('/contact')}><span role="img" aria-label="contact us">✉️</span> Contact Us</li>
    <li onClick={() => onNavigate('/offers')}>
  <span role="img" aria-label="offers">🎁</span> Offers
</li>
    <button onClick={onLogout} className="logout-button">🚪 Logout</button>
</ul>
    </div>
);

const BookingCard = ({ booking, onEdit }) => (
    <div className="booking-card">
        <div className="time-info">
            <p>{booking.departureTime}</p>
            <p>{booking.departureLocation}</p>
        </div>
        <p>Duration: {booking.duration}</p>
        <div className="time-info">
            <p>{booking.arrivalTime}</p>
            <p>{booking.arrivalLocation}</p>
        </div>
        <p>Date: {booking.date}</p>
        <p>Flight Number: {booking.flightNumber}</p>
        <button className="edit-btn" onClick={onEdit}>Edit</button>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();

    const [userDetails, setUserDetails] = useState({
        first_name: '',
        last_name: '',
        address: '',
        country: '',
        dob: '',
        gender: '',
        passport_number: '',
        state: ''
    });

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            navigate('/login'); 
        } else {
         
            setUserDetails({
                first_name: localStorage.getItem('first_name') || '',
                last_name:localStorage.getItem('last_name') || '',
                address: localStorage.getItem('address') || '',
                country: localStorage.getItem('country') || '',
                dob: localStorage.getItem('dob') || '',
                gender: localStorage.getItem('gender') || '',
                passport_number: localStorage.getItem('passport_number') || '',
                state: localStorage.getItem('state') || ''
            });
        }

       
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear(); 
       
        navigate('/login'); 
    };

    const handleEdit = () => {
        navigate('/report'); 
    };

    const handleBooking = () => {
        navigate('/customer/ViewFlights'); 
    };

    return (
        <div className="dashboard-container">
            <Sidebar onLogout={handleLogout} onNavigate={navigate} />
            <div className="main-content">
                <header className="header">
                    <div className="profile">
                    <img src="/8.jpg" alt="Profile" className="profile-icon" />
                        <p>{`${userDetails.first_name} ${userDetails.last_name}`}</p>
                    </div>
                </header>
                <div className="booking-info">
    <h1>Online Booking System for all service-based industries</h1>
     
    <UserDetails/>

    <h2>  Simply define your services and providers, display their availability, and manage bookings 24/7.</h2>
    <button className="book-btn" onClick={handleBooking}>Book here</button>
</div>

                <section className="featured-destinations">
        <h2>Featured Destinations</h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <img src="/paris.jpg" alt="Destination" />
            <h3>Paris</h3>
          </div>
          <div className="destination-card">
            <img src="/maldives.jpg" alt="Destination" />
            <h3>Maldives</h3>
          </div>
          <div className="destination-card">
            <img src="/Switzerland.jpg" alt="Destination" />
            <h3>Switzerland</h3>
          </div>
          <div className="destination-card">
            <img src="/srilanka.jpg" alt="Destination" />
            <h3>Sri Lanka</h3>
          </div>
          <div className="destination-card">
            <img src="/malaysia.jpg" alt="Destination" />
            <h3>Malaysia</h3>
          </div>
          <div className="destination-card">
            <img src="/australia.jpg" alt="Destination" />
            <h3>Australia</h3>
          </div>
        </div>
      </section>
    </div> 
</div>
    );
};

export default Dashboard;
