// src/components/SignupForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './SignupForm.css';

const SignupForm = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        dob: '',
        passport_number: '',
        gender: '',
        mobile_num: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:3000/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData), 
            });

            if (response.ok) {
                setSuccessMessage('Account created successfully! Redirecting to login...');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                const message = await response.text();
                setErrorMessage(message);
            }
        } catch (error) {
            console.error('Error signing up:', error);
            setErrorMessage('Failed to sign up. Please try again.');
        }
    };

    const handleLoginRedirect = () => {
        navigate('/login');
    };

    return (
        <div className="signup-container-wrapper">
            <div className="signup-container">
                <h2>Create a new Account</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>} 

                <form onSubmit={handleSignup}>
                    <label>
                        First Name:
                        <input
                            type="text"
                            name="first_name"
                            value={userData.first_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            name="last_name"
                            value={userData.last_name}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Date of Birth:
                        <input
                            type="date"
                            name="dob"
                            value={userData.dob}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Passport Number:
                        <input
                            type="text"
                            name="passport_number"
                            value={userData.passport_number}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Gender:
                        <select name="gender" value={userData.gender} onChange={handleChange} required>
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                    <label>
                        Mobile Number:
                        <input
                            type="text"
                            name="mobile_num"
                            value={userData.mobile_num}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={userData.email}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <label>
                        Password:
                        <input
                            type="password"
                            name="password"
                            value={userData.password}
                            onChange={handleChange}
                            required
                        />
                    </label>
                    <button type="submit">Sign Up</button>
                    <button type="button" onClick={handleLoginRedirect} className="login-button">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignupForm;
