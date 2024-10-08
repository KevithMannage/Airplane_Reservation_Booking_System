import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import HomePage from './HomePage.jsx';
import Offers from './Offers.jsx';
import Footer from './Footer.jsx';
import LoginForm from './LoginForm.jsx';
import SignUpForm from './SignUpForm.jsx';
import ContactPage from './ContactPage.jsx';
import About from './About.jsx';
import Flights from './Flights.jsx';
import TermsAndConditions from './TermsAndConditions.jsx';
import Services from './Services.jsx';
import BookAndSearchFlight from './BookAndSearchFlight.jsx';
import BookingPage from './BookingPage.jsx';
import SubmitPage from './SubmitPage';
import SignupForm from './SignUpForm.jsx';
import Dashboard from './Dashboard.jsx';
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

    // Fetch flight data in useEffect

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

                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
