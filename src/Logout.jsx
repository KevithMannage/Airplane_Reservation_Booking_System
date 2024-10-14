// src/components/Logout.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear token from localStorage
        localStorage.removeItem('token');
        localStorage.removeItem("user_id");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem('address');
        localStorage.removeItem('country');
        localStorage.removeItem('dob');
        localStorage.removeItem('email');
        localStorage.removeItem('first_name');
        localStorage.removeItem('gender');
        localStorage.removeItem('last_name');
        localStorage.removeItem('passport_number');
        localStorage.removeItem('state');
        console.log('User logged out. Token removed.');

        // Redirect to login page
        navigate('/login');
    }, [navigate]);

    return <div>Logging out...</div>;
};

export default Logout;
