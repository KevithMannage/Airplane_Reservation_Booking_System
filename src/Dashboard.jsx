import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

// Sidebar Component
const Sidebar = ({ onLogout, onNavigate }) => (
    <div className="sidebar">
        <h2>Booking</h2>
        <ul>
            <li onClick={() => onNavigate('/')}>Home</li>
            <li onClick={() => onNavigate('/bookings')}>Bookings</li>
            <li onClick={() => onNavigate('/calendar')}>Calendar</li>
            <li onClick={() => onNavigate('/notifications')}>Notifications</li>
            <li onClick={() => onNavigate('/trash')}>Trash</li>
            <li onClick={() => onNavigate('/settings')}>Settings</li>
        </ul>
        <button onClick={onLogout} className="logout-button">Logout</button>
    </div>
);

// Booking Card Component

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
// Main Dashboard Component
const Dashboard = () => {
    const navigate = useNavigate();

    // State to hold user details
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

    // Sample booking data
    const [bookings, setBookings] = useState([
        { departureTime: '6:30 PM', departureLocation: 'Dhaka', arrivalTime: '9:30 PM', arrivalLocation: 'Kolkata', duration: '3 hours', date: '27-06-2022', flightNumber: 'DH 202' },
        { departureTime: '5:30 PM', departureLocation: 'Dhaka', arrivalTime: '7:30 PM', arrivalLocation: 'Delhi', duration: '3 hours', date: '31-08-2022', flightNumber: 'FG 603' }
    ]);

    // Check if the user is logged in
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page if not logged in
        } else {
            // Retrieve the details from localStorage if logged in
            const first_name = localStorage.getItem('first_name');
            const last_name = localStorage.getItem('last_name');
            const address = localStorage.getItem('address');
            const country = localStorage.getItem('country');
            const dob = localStorage.getItem('dob');
            const gender = localStorage.getItem('gender');
            const passport_number = localStorage.getItem('passport_number');
            const state = localStorage.getItem('state');

            // Set the retrieved details into state
            setUserDetails({
                first_name,
                last_name,
                address,
                country,
                dob,
                gender,
                passport_number,
                state
            });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn'); // Clear login status
        navigate('/login'); // Redirect to login page after logout
    };

    // Function to handle the Edit button click and navigate to the report page
    const handleEdit = () => {
        navigate('/report'); // Redirect to the report page
    };

    // Function to handle the Book button click and navigate to the booking page
    const handleBooking = () => {
        navigate('/customer/ViewFlights'); // Redirect to the booking page
    };

    return (
        <div className="dashboard-container">
            <Sidebar onLogout={handleLogout} onNavigate={navigate} />
            <div className="main-content">
                <header className="header">
                    <div className="profile">
                        <p>{userDetails.first_name} {userDetails.last_name}</p>
                        <img src="/8.jpg" alt="Profile" className="profile-icon" />
                    </div>
                </header>
                <section className="booking-info">
                    <h1>Online Booking System for all service-based industries</h1>
                    <p>Simply define your services and providers, display their availability, and manage bookings 24/7.</p>
                    <button className="book-btn" onClick={handleBooking}>Book here</button>
                    <h2>All Bookings</h2>
                    <div className="booking-list">
                        {bookings.map((booking, index) => (
                            <BookingCard key={index} booking={booking} onEdit={handleEdit} />
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
