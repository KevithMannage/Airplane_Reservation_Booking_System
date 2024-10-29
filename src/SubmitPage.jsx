import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmitPage.css';

const SubmitPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookedSeatNum, ticketType, scheduleId } = location.state || {};

    const [ticketEntries, setTicketEntries] = useState([]);
    const [error, setError] = useState('');
    const [successMessages, setSuccessMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [completedBookings, setCompletedBookings] = useState([]);
    const [failedBookings, setFailedBookings] = useState([]);
    const [ticketPrices, setTicketPrices] = useState({ economy: 0, business: 0, platinum: 0 });
    const [formVisible, setFormVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [isTimerActive, setIsTimerActive] = useState(true); // New state for timer activity
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true'; // Check login status

    const gotohomepage = () => {
        navigate('/');
    };



    useEffect(() => {
        if (bookedSeatNum) {
            const initialEntries = bookedSeatNum.map(() => ({
                email: '',
                full_name: '',
                dob: '',
                gender: '',
                passport_number: '',
                mobile_num: '',
                isBooked: false,
            }));
            setTicketEntries(initialEntries);
        }
    }, [bookedSeatNum]);

    useEffect(() => {
        // Timer countdown logic
        const timer = setInterval(() => {
            if (timeLeft > 0 && isTimerActive) {
                setTimeLeft((prevTime) => prevTime - 1);
            } else if (timeLeft === 0) {
                gotohomepage();
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, isTimerActive]);



    useEffect(() => {
        const fetchPrices = async () => {
            try {
                const response = await fetch(`http://localhost:3000/schedule/flight/${scheduleId}`);
                if (response.ok) {
                    const data = await response.json();
                    setTicketPrices({
                        economy: data.economy_price,
                        business: data.business_price,
                        platinum: data.platinum_price,
                    });
                } else {
                    setError('Failed to retrieve ticket prices.');
                }
            } catch (error) {
                console.error('Error fetching ticket prices:', error);
                setError('Error fetching ticket prices.');
            }
        };
        fetchPrices();
    }, [scheduleId]);

    const fetchDiscountedPrice = async (email, basePrice) => {
        try {
            const response = await fetch(`http://localhost:3000/user/email/${email}`);
            if (response.ok) {
                const data = await response.json();
                const discount = data.tier === 'Gold' ? 0.91 : data.tier === 'Frequent' ? 0.95 : 1;
                return basePrice * discount;
            } else {
                console.error(`Failed to retrieve tier for email ${email}`);
                return basePrice;
            }
        } catch (error) {
            console.error(`Error fetching tier for email ${email}:`, error);
            return basePrice;
        }
    };

    const handleChange = (index, e) => {
        const { name, value } = e.target;
        setTicketEntries((prevEntries) => {
            const newEntries = [...prevEntries];
            newEntries[index] = {
                ...newEntries[index],
                [name]: value,
            };
            return newEntries;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
    
        try {
            const successMessages = [];
            const errorMessages = [];
            const newCompletedBookings = [];
            const newFailedBookings = [];
    
            for (let index = 0; index < ticketEntries.length; index++) {
                const entry = ticketEntries[index];
    
                // If isBooked is true, skip further processing for this entry
                if (entry.isBooked) {
                    newCompletedBookings.push({
                        ...entry,
                        seat_no: bookedSeatNum[index], // Ensure seat number is included
                        ticketCost: entry.ticketCost || 0 // Ensure ticket cost is included
                    });
                    continue; // Skip already booked entries
                }
    
                const basePrice = bookedSeatNum[index][0] === 'E'
                    ? ticketPrices.economy
                    : bookedSeatNum[index][0] === 'B'
                        ? ticketPrices.business
                        : ticketPrices.platinum;
    
                let ticketCost = basePrice;
    
                if (entry.email) {
                    const discountedPrice = await fetchDiscountedPrice(entry.email, basePrice);
                    if (discountedPrice === basePrice) {
                        errorMessages.push(`Email ${entry.email} is not registered for Passenger ${index + 1}.`);
                        newFailedBookings.push(entry);
                        continue;
                    }
                    ticketCost = discountedPrice;
                }
    
                const bookingData = {
                    email: entry.email || null,
                    full_name: entry.full_name,
                    gender: entry.gender,
                    dob: entry.dob,
                    passport_number: entry.passport_number,
                    mobile_num: entry.mobile_num,
                    schedule_id: scheduleId,
                    seat_no: bookedSeatNum[index],
                    ticketCost, // Keep it here to send to the server
                };
    
                const response = await fetch('http://localhost:3000/booking/addBooking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                });
    
                if (!response.ok) {
                    const result = await response.json();
                    errorMessages.push(result.message || `Booking failed for Passenger ${index + 1}.`);
                    newFailedBookings.push(entry);
                } else {
                    const result = await response.json();
                    successMessages.push(result.message || `Booking succeeded for Passenger ${index + 1}.`);
                    newCompletedBookings.push({
                        ...bookingData,
                        isBooked: true, // Mark as booked
                    });
                    setTicketEntries(prev => {
                        const newEntries = [...prev];
                        newEntries[index].isBooked = true; // Update the entry to reflect it's booked
                        newEntries[index].ticketCost = ticketCost; // Update ticket cost
                        return newEntries;
                    });
                }
            }
    
            if (errorMessages.length > 0) {
                setError(errorMessages.join(', '));
                setFailedBookings(newFailedBookings);
                setSuccessMessages([]);
            } else {
                setSuccessMessages(successMessages);
                setCompletedBookings(newCompletedBookings); // Set completed bookings that are successfully booked
                setFormVisible(false); // Hide form if all bookings succeed
                setIsTimerActive(false);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            setError('An error occurred while booking the flight. Please check your input and try again.');
            setSuccessMessages([]);
        } finally {
            setLoading(false);
        }
    };
    
    return (
        <div className="submit-page">
            <h2>Booking Submission</h2>
            {isTimerActive && (
                <div className="time-left">
                    Time Left: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                </div>
            )}
            {!completedBookings.length && !error && (
                <p>Please fill in the details for the passengers below:</p>
            )}

            {formVisible && (
                <div className="form-container">
                    <p><strong>Scheduled ID:</strong> {scheduleId}</p>
                    <p><strong>Ticket Type:</strong> {ticketType}</p>
                    <p><strong>Booked Seats:</strong> {Array.isArray(bookedSeatNum) ? bookedSeatNum.join(', ') : bookedSeatNum}</p>

                    <form onSubmit={handleSubmit}>
                        {ticketEntries.map((entry, index) => (
                            <div key={index} className={entry.isBooked ? 'booked-entry' : ''}>
                                <h3>Passenger {index + 1} ({bookedSeatNum[index]} seat)</h3>
                                {Object.keys(entry).map((key) => (
                                    <div key={key}>
                                        {key === 'email' && !isLoggedIn ? null : (
                                            <label>
                                                {key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                                                {key === 'gender' ? (
                                                    <select
                                                        name={key}
                                                        value={entry[key]}
                                                        onChange={(e) => handleChange(index, e)}
                                                        required
                                                        disabled={entry.isBooked}
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="Male">Male</option>
                                                        <option value="Female">Female</option>
                                                    </select>
                                                ) : (
                                                    <input
                                                        type={key === 'dob' ? 'date' : 'text'}
                                                        name={key}
                                                        value={entry[key]}
                                                        onChange={(e) => handleChange(index, e)}
                                                        required={key !== 'email'}
                                                        disabled={entry.isBooked}
                                                        placeholder={key === 'email' ? 'Registered passenger email' : ''}
                                                    />
                                                )}
                                            </label>
                                        )}
                                    </div>
                                ))}
                                <hr />
                            </div>
                        ))}
                        <button type="submit" disabled={loading}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>
                    {error && <div className="error">{error}</div>}
                </div>
            )}

            {successMessages.length > 0 && (
                <div className="success">
                    <h3>Success Messages:</h3>
                    <ul>
                        {successMessages.map((msg, index) => (
                            <li key={index}>{msg}</li>
                        ))}
                    </ul>
                </div>
            )}

            {completedBookings.length > 0 && (
                <div className="completed-bookings">
                    <h3>Completed Bookings:</h3>
                    <ul>
                        {completedBookings.map((booking, index) => (
                            <li key={index}>
                                <div className="booking-details">
                                    <p><strong>Passenger {index + 1} Details:</strong></p>
                                    <p><strong>Name:</strong> {booking.full_name}</p>
                                    <p><strong>Phone Number:</strong> {booking.mobile_num || "Not Provided"}</p>
                                    <p><strong>Email:</strong> {booking.email || "Not Provided"}</p>
                                    <p><strong>Seat Number:</strong> {booking.seat_no}</p>
                                    <p><strong>Ticket Price:</strong> ${booking.ticketCost ? booking.ticketCost.toFixed(2) : 'N/A'}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <button onClick={gotohomepage} className="Homepage-button">
                Go to Home
            </button>
        </div>
    );
};

export default SubmitPage;