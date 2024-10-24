import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import HomePage from './HomePage.jsx';
import Offers from './Offers.jsx';
import Footer from './Footer.jsx';
import LoginForm from '../usercomponents/LoginForm.jsx';
import SignUpForm from '../usercomponents/SignUpForm.jsx';
import ContactPage from '../ContactPage.jsx';
import About from './About.jsx';
import Flights from '../FlightBooking/flights.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import Services from './Services.jsx';
import BookAndSearchFlight from '../FlightBooking/BookAndSearchFlight.jsx';
import BookingPage from '../FlightBooking/BookingPage.jsx';
import SubmitPage from '../FlightBooking/SubmitPage.jsx';
import SignupForm from '../usercomponents/SignUpForm.jsx';
import Dashboard from '../usercomponents/Dashboard.jsx';
import Logout from '../Logout.jsx';
import UserBookings from '../usercomponents/UserBookings.jsx';
import UserDetails from '../usercomponents/UserDetails.jsx';

function App() {
      
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    const handleLogin = (username, password) => {
        if (username && password) {
            setIsAuthenticated(true);
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
    };

      
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/offers" element={<Offers />} />
                        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
                        <Route path="/sign-up" element={<SignUpForm />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
                        <Route path="/Services" element={<Services />} />
                        <Route path="/Airplanes" element={<Flights />} />
                        <Route path="/customer/ViewFlights" element={<BookingPage />} />
                        <Route path="/Flights" element={<BookAndSearchFlight />} />
                        <Route path="/" element={<BookingPage />} />
                        <Route path="/submit-details" element={<SubmitPage />} />
                        <Route path="/login" element={<LoginForm />} />
                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/logout" element={<Logout />} />
                        <Route path="/user-details" element={<UserDetails />} />
                        <Route path="/bookings" element={<UserBookings />} /> {/* Bookings route */}
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;