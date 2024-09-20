// src/components/SignUpPage.jsx
import React, { useState } from 'react';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        user_id: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        gender: '',
        dob: '',
        passport_number: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(formData)
            });

            const result = await response.json();

            if (response.ok) {
                setSuccess('Account created successfully!');
                setError('');
            } else {
                setSuccess('');
                setError(result.message || 'Failed to create account.');
            }
        } catch (err) {
            setSuccess('');
            setError('An error occurred. Please try again.');
            console.error('Sign-up error:', err);
        }
    };

    return (
        <div className="signup-page">
            <h2>Create Account</h2>
            <form onSubmit={handleSignUp}>
                {error && <p className="error">{error}</p>}
                {success && <p className="success">{success}</p>}
                {/* Form Fields */}
                {/* ... */}
                <button type="submit">Sign Up</button>
                <p>Already have an account? <a href="/login">Login here</a></p>
            </form>
        </div>
    );
};

export default SignUpPage;
