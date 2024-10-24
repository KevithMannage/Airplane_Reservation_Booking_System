import React, { useState } from 'react';
import axios from 'axios';
import './RegisterForm.css';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        gender: '',
        dob: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/register', formData);
            alert(response.data.message); // Show success message
        } catch (error) {
            alert(error.response?.data?.message || 'Error registering user');
        }
    };

    return (
        <div className="Register-container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
                <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
                <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} placeholder="First Name" required />
                <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} placeholder="Last Name" required />
                <select name="gender" value={formData.gender} onChange={handleChange} required>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default RegisterForm;
