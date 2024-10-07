import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SubmitPage.css'; // Ensure you have this CSS file

const SubmitPage = () => {
  const location = useLocation();
  const { bookedSeatNum, ticketType, scheduleId, personalDetails } = location.state || {};
  
  // State to manage form inputs
  const [formData, setFormData] = useState({
    first_name: personalDetails?.first_name || '',
    last_name: personalDetails?.last_name || '',
    dob: personalDetails?.dob || '',
    gender: personalDetails?.gender || '',
    passport_number: personalDetails?.passport_number || '',
    address: personalDetails?.address || '',
    state: personalDetails?.state || '',
    country: personalDetails?.country || '',
  });

  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(300); // 5 minutes in seconds

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { first_name, last_name, dob, gender, passport_number, address, state, country } = formData;

    // Simple validation
    if (!first_name || !last_name || !dob || !gender || !passport_number || !address || !state || !country) {
      setError('Please fill in all fields.');
      return;
    }

    setError(''); // Clear error message
    setLoading(true); // Start loading

    // Prepare the data for the API call
    const bookingData = {
      schedule_id: scheduleId,
      ticket_type: ticketType,
      seat_no: bookedSeatNum,
      first_name,
      last_name,
      dob,
      gender,
      passport_number,
      address,
      state,
      country,
    };

    try {
      const response = await fetch('http://localhost:3000/booking/addBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage('Booking successfully completed! 🎉');
        // Optionally, you can clear the form or redirect as needed
        setFormData({
          first_name: '',
          last_name: '',
          dob: '',
          gender: '',
          passport_number: '',
          address: '',
          state: '',
          country: '',
        });
      } else {
        setError(result.message || 'Failed to book the flight. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while booking the flight.');
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (timer === 0) return; // Stop if timer reaches zero
    const intervalId = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    
    return () => clearInterval(intervalId); // Cleanup on component unmount
  }, [timer]);

  return (
    <div>
      <h1>Submit Your Details</h1>
      {/* Timer display */}
      <div className="timer">
        <p>Time left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
      </div>
      {bookedSeatNum && ticketType && scheduleId && (
        <div>
          <p><strong>Scheduled ID:</strong> {scheduleId}</p>
          <p><strong>Ticket Type:</strong> {ticketType}</p>
          <p><strong>Booked Seat:</strong> {bookedSeatNum}</p>

          {personalDetails && (
            <div>
              <h2>Your Personal Details</h2>
              <p><strong>First Name:</strong> {personalDetails.first_name}</p>
              <p><strong>Last Name:</strong> {personalDetails.last_name}</p>
              <p><strong>Date of Birth:</strong> {personalDetails.dob}</p>
              <p><strong>Gender:</strong> {personalDetails.gender}</p>
              <p><strong>Passport Number:</strong> {personalDetails.passport_number}</p>
              <p><strong>Address:</strong> {personalDetails.address}</p>
              <p><strong>State:</strong> {personalDetails.state}</p>
              <p><strong>Country:</strong> {personalDetails.country}</p>
            </div>
          )}

          {/* Form for submitting personal details */}
          <h2>Submit Your Information</h2>
          <form onSubmit={handleSubmit}>
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <label>
                  {key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                  <input
                    type={key === 'dob' ? 'date' : 'text'} // Use date input for DOB
                    name={key}
                    value={formData[key]}
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
            ))}
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>
          
          {/* Display success and error messages */}
          {error && <p className="error-message">{error}</p>}
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
      )}
    </div>
  );
};

export default SubmitPage;
