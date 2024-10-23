/*/*
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

    // State to hold bookings data
    const [bookings, setBookings] = useState([]);

    // Check if the user is logged in and fetch user details
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

        // Fetch booking data from an API or a server
        fetch('http://localhost:3000/bookings') // Adjust the API endpoint as necessary
            .then(response => response.json())
            .then(data => setBookings(data)) // Set fetched booking data into state
            .catch(error => console.error('Error fetching bookings:', error));
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
                        {bookings.length > 0 ? (
                            bookings.map((booking, index) => (
                                <BookingCard key={index} booking={booking} onEdit={handleEdit} />
                            ))
                        ) : (
                            <p>No bookings available</p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Dashboard;
*/
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import { RiH6 } from 'react-icons/ri';

// Sidebar Component
const Sidebar = ({ onLogout, onNavigate }) => (
    <div className="sidebar">
        <h2>Booking</h2>
        <ul>
    <li onClick={() => onNavigate('/')}><span role="img" aria-label="home">🏠</span> Home</li>
    <li onClick={() => onNavigate('/bookings')}><span role="img" aria-label="bookings">📅</span> Bookings</li>
    <li onClick={() => onNavigate('/notifications')}><span role="img" aria-label="notifications">🔔</span> Notifications</li>
    <li onClick={() => onNavigate('/settings')}><span role="img" aria-label="settings">⚙️</span> Settings</li>
    <li onClick={() => onNavigate('/contact')}><span role="img" aria-label="contact us">✉️</span> Contact Us</li>
    <li onClick={() => onNavigate('/user-details')}><span role="img" aria-label="user details">👤</span> User Details </li>
    <button onClick={onLogout} className="logout-button">🚪 Logout</button>
</ul>
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

    // State to hold bookings data
    const [bookings, setBookings] = useState([]);

    // Effect to check if the user is logged in and fetch user details
    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (!isLoggedIn) {
            navigate('/login'); // Redirect to login page if not logged in
        } else {
            // Retrieve the user details from localStorage
            setUserDetails({
                first_name: localStorage.getItem('first_name') || '',
                last_name: localStorage.getItem('last_name') || '',
                address: localStorage.getItem('address') || '',
                country: localStorage.getItem('country') || '',
                dob: localStorage.getItem('dob') || '',
                gender: localStorage.getItem('gender') || '',
                passport_number: localStorage.getItem('passport_number') || '',
                state: localStorage.getItem('state') || ''
            });
        }

        // Fetch booking data from an API
       
    }, [navigate]);

    const handleLogout = () => {
        localStorage.clear(); 
       // localStorage.removeItem('isLoggedIn'); // Clear login status
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
                    <img src="/8.jpg" alt="Profile" className="profile-icon" />
                        <p>{`${userDetails.first_name} ${userDetails.last_name}`}</p>
                    </div>
                </header>
                <div className="booking-info">
    <h1>Online Booking System for all service-based industries</h1>
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
