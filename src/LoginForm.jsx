// src/components/LoginForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import './LoginForm.css'; // Import the CSS file for styling

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            navigate('/dashboard'); // Redirect to dashboard if logged in
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                
                // Store token and user data in local storage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user_id', data.user.user_id);
                localStorage.setItem('address', data.user.address);
                localStorage.setItem('country', data.user.country);
                localStorage.setItem('dob', data.user.dob);
                localStorage.setItem('email', data.user.email);
                localStorage.setItem('first_name', data.user.first_name);
                localStorage.setItem('gender', data.user.gender);
                localStorage.setItem('last_name', data.user.last_name);
                localStorage.setItem('passport_number', data.user.passport_number);
                localStorage.setItem('state', data.user.state);
                localStorage.setItem('isLoggedIn', 'true'); // Set logged-in status

                console.log('Login successful:', data);
                navigate('/dashboard'); // Navigate to dashboard after successful login
            } else {
                const message = await response.text();
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Error logging in:', error);
            setErrorMessage('Failed to log in. Please try again.');
        }
    };

    const handleSignup = () => {
        navigate('/signup'); // Navigate to signup page
    };

    return (
        <div className="logo">
            <div className="login-container">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleLogin}>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button type="submit">Login</button>
                </form>
                <button onClick={handleSignup} className="signup-button">
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default LoginForm;
