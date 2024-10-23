/*import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SubmitPage.css'; // Ensure you have this CSS file

const SubmitPage = () => {
  const location = useLocation();
  const { bookedSeatNum, ticketType, scheduleId } = location.state || {};

  // State to manage multiple form entries
  const [ticketEntries, setTicketEntries] = useState([]);
  const [error, setError] = useState('');
  const [successMessages, setSuccessMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(10000); // 5 minutes in seconds

  // Load initial ticket entries based on booked seats
  useEffect(() => {
    if (bookedSeatNum) {
      const initialEntries = bookedSeatNum.map(() => ({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        passport_number: '',
        address: '',
        state: '',
        country: '',
      }));
      setTicketEntries(initialEntries);
    }
  }, [bookedSeatNum]);

  // Handle form input changes for multiple entries
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEntries = [...ticketEntries];
    updatedEntries[index][name] = value;
    setTicketEntries(updatedEntries);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all required fields are filled
    for (const entry of ticketEntries) {
      if (!entry.first_name || !entry.last_name || !entry.dob || !entry.gender || !entry.passport_number || !entry.address || !entry.state || !entry.country) {
        setError('Please fill in all fields for each passenger.');
        return;
      }
    }

    setError(''); // Clear error message
    setLoading(true); // Start loading

    const currentDate = new Date().toISOString().split('T')[0];
    const userId = localStorage.getItem('user_id'); // Retrieve user ID

    if (!userId) {
      setError('User ID is null. Please log in to book tickets.'); // Show error for null user ID
      setLoading(false); // Stop loading
      return; // Exit if user ID is null
    }

    const bookingPromises = ticketEntries.map((entry, index) => {
      const bookingData = {
        user_id: userId,
        schedule_id: scheduleId,
        ticket_type: ticketType,
        seat_no: bookedSeatNum[index],
        first_name: entry.first_name,
        last_name: entry.last_name,
        dob: entry.dob,
        gender: entry.gender,
        passport_number: entry.passport_number,
        address: entry.address,
        state: entry.state,
        country: entry.country,
        date: currentDate,
      };

      return fetch('http://localhost:3000/booking/addBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
    });

    try {
      const responses = await Promise.all(bookingPromises);
      const results = await Promise.all(responses.map(res => res.json()));

      console.log(results); // Log the results for debugging

      const errorMessages = [];
      const successMessages = [];

      results.forEach(result => {
        if (result.message) {
          successMessages.push(result.message); // Collect success messages
        } else {
          errorMessages.push('Some bookings failed. Please try again.'); // Collect error messages if necessary
        }
      });

      if (errorMessages.length > 0) {
        setError(errorMessages.join(', ')); // Set error message
        setSuccessMessages([]); // Clear success messages on error
      } else {
        setSuccessMessages(successMessages); // Set success messages
        setTicketEntries([]); // Clear ticket entries after successful submission
      }
    } catch (error) {
      console.error('Error during booking:', error);
      setError('An error occurred while booking the flight.');
      setSuccessMessages([]); // Clear success messages on error
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
    <div className="submit-page">
      <h1>Submit Your Details</h1>
      <div className="timer">
        <p>Time left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
      </div>
      {bookedSeatNum && ticketType && scheduleId && (
        <div>
          <p><strong>Scheduled ID:</strong> {scheduleId}</p>
          <p><strong>Ticket Type:</strong> {ticketType}</p>
          <p><strong>Booked Seats:</strong> {Array.isArray(bookedSeatNum) ? bookedSeatNum.join(', ') : bookedSeatNum}</p>

          <h2>Submit Your Information for {bookedSeatNum.length} Passenger{bookedSeatNum.length > 1 ? 's' : ''}</h2>
          <form onSubmit={handleSubmit}>
            {ticketEntries.map((entry, index) => (
              <div key={index}>
                <h3>Passenger {index + 1}</h3>
                {Object.keys(entry).map((key) => (
                  <div key={key}>
                    <label>
                      {key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                      <input
                        type={key === 'dob' ? 'date' : 'text'}
                        name={key}
                        value={entry[key]}
                        onChange={(e) => handleChange(e, index)}
                        required
                      />
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
          {successMessages.length > 0 && (
            <div>
              {successMessages.map((msg, index) => (
                <p key={index} className="success-message">{msg}</p> // Display each success message
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubmitPage;*/

/*
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmitPage.css';

const SubmitPage = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Use navigate for redirecting
  const { bookedSeatNum, ticketType, scheduleId } = location.state || {};

  // State to manage multiple form entries
  const [ticketEntries, setTicketEntries] = useState([]);
  const [error, setError] = useState('');
  const [successMessages, setSuccessMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(3000); // 5 minutes in seconds
  const [isBookingComplete, setIsBookingComplete] = useState(false); // To track booking completion
  const [isTimeExpired, setIsTimeExpired] = useState(false); // Track if the time has expired

  // Load initial ticket entries based on booked seats
  useEffect(() => {
    if (bookedSeatNum) {
      const initialEntries = bookedSeatNum.map(() => ({
        first_name: '',
        last_name: '',
        dob: '',
        gender: '',
        passport_number: '',
        address: '',
        state: '',
        country: '',
      }));
      setTicketEntries(initialEntries);
    }
  }, [bookedSeatNum]);

  // Handle form input changes for multiple entries
  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedEntries = [...ticketEntries];
    updatedEntries[index][name] = value;
    setTicketEntries(updatedEntries);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTimeExpired) {
      setError('Time has expired. You cannot submit the form.');
      return;
    }

    for (const entry of ticketEntries) {
      if (!entry.first_name || !entry.last_name || !entry.dob || !entry.gender || !entry.passport_number || !entry.address || !entry.state || !entry.country) {
        setError('Please fill in all fields for each passenger.');
        return;
      }
    }

    setError('');
    setLoading(true);

    const currentDate = new Date().toISOString().split('T')[0];
    const userId = localStorage.getItem('user_id'); // Retrieve user ID

    if (!userId) {
      setError('User ID is null. Please log in to book tickets.');
      setLoading(false);
      return;
    }

    const bookingPromises = ticketEntries.map((entry, index) => {
      const bookingData = {
        user_id: userId,
        schedule_id: scheduleId,
        ticket_type: ticketType,
        seat_no: bookedSeatNum[index],
        first_name: entry.first_name,
        last_name: entry.last_name,
        dob: entry.dob,
        gender: entry.gender,
        passport_number: entry.passport_number,
        address: entry.address,
        state: entry.state,
        country: entry.country,
        date: currentDate,
      };

      return fetch('http://localhost:3000/booking/addBooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });
    });

    try {
      const responses = await Promise.all(bookingPromises);
      const results = await Promise.all(responses.map(res => res.json()));

      console.log(results);

      const errorMessages = [];
      const successMessages = [];

      results.forEach(result => {
        if (result.message) {
          successMessages.push(result.message);
        } else {
          errorMessages.push('Some bookings failed. Please try again.');
        }
      });

      if (errorMessages.length > 0) {
        setError(errorMessages.join(', '));
        setSuccessMessages([]);
      } else {
        setSuccessMessages(successMessages);
        setIsBookingComplete(true);
        setTicketEntries([]);
      }
    } catch (error) {
      console.error('Error during booking:', error);
      setError('An error occurred while booking the flight.');
      setSuccessMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Countdown timer effect
  useEffect(() => {
    if (timer === 0 || isBookingComplete) {
      if (!isBookingComplete) {
        setIsTimeExpired(true); // Time has expired, prevent submission
      }
      return;
    }

    const intervalId = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer, isBookingComplete]);

  // Redirect to home after time expiration
  useEffect(() => {
    if (isTimeExpired) {
      setTimeout(() => {
        navigate('/'); // Redirect to home after 3 seconds
      }, 30000);
    }
  }, [isTimeExpired, navigate]);

  return (
    <div className="submit-page">
      <h1>Submit Your Details</h1>

      {!isBookingComplete && !isTimeExpired && (
        <div className="timer">
          <p>Time left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
        </div>
      )}

      {isTimeExpired ? (
        <div className="time-expired">
          <h2>Time has expired! You will be redirected to the home page.</h2>
        </div>
      ) : bookedSeatNum && ticketType && scheduleId && !isBookingComplete && (
        <div>
          <p><strong>Scheduled ID:</strong> {scheduleId}</p>
          <p><strong>Ticket Type:</strong> {ticketType}</p>
          <p><strong>Booked Seats:</strong> {Array.isArray(bookedSeatNum) ? bookedSeatNum.join(', ') : bookedSeatNum}</p>

          <h2>Submit Your Information for {bookedSeatNum.length} Passenger{bookedSeatNum.length > 1 ? 's' : ''}</h2>
          <form onSubmit={handleSubmit}>
            {ticketEntries.map((entry, index) => (
              <div key={index}>
                <h3>Passenger {index + 1}</h3>
                {Object.keys(entry).map((key) => (
                  <div key={key}>
                    <label>
                      {key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                      <input
                        type={key === 'dob' ? 'date' : 'text'}
                        name={key}
                        value={entry[key]}
                        onChange={(e) => handleChange(e, index)}
                        required
                        disabled={isTimeExpired} // Disable inputs if time expired
                      />
                    </label>
                  </div>
                ))}
              </div>
            ))}
            <button type="submit" disabled={loading || isTimeExpired}>
              {loading ? 'Submitting...' : 'Submit'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
          {successMessages.length > 0 && (
            <div>
              {successMessages.map((msg, index) => (
                <p key={index} className="success-message">{msg}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {isBookingComplete && (
        <div className="booking-complete">
          <h2>Booking Completed Successfully!</h2>
        </div>
      )}
    </div>
  );
};

export default SubmitPage;
*/
/*
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './SubmitPage.css';

const SubmitPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { bookedSeatNum, ticketType, scheduleId } = location.state || {};

    // State to manage form entries and other UI elements  
    const [ticketEntries, setTicketEntries] = useState([]);
    const [error, setError] = useState('');
    const [successMessages, setSuccessMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(50000); // 5 minutes (300 seconds)
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [isTimeExpired, setIsTimeExpired] = useState(false);

    // Get user ID from local storage
    const userId = localStorage.getItem('user_id');

    // Initialize form fields for each passenger based on booked seats
    useEffect(() => {
        if (bookedSeatNum) {
            const initialEntries = bookedSeatNum.map(() => ({
                first_name: '',
                last_name: '',
                dob: '',
                gender: '',
                passport_number: '',
                address: '',
                state: '',
                country: '',
            }));
            setTicketEntries(initialEntries);
        }
    }, [bookedSeatNum]);

    // Handle form input changes for each passenger
    const handleChange = (e, index) => {
        const { name, value } = e.target;
        const updatedEntries = [...ticketEntries];
        updatedEntries[index][name] = value;
        setTicketEntries(updatedEntries);
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isTimeExpired) {
            setError('Time has expired. You cannot submit the form.');
            return;
        }

        // Validate form entries
        for (const entry of ticketEntries) {
            if (!Object.values(entry).every(field => field)) {
                setError('Please fill in all fields for each passenger.');
                return;
            }
        }

        setError('');
        setLoading(true);

        const currentDate = new Date().toISOString().split('T')[0];

        try {
            // Submit booking requests for each passenger
            const bookingPromises = ticketEntries.map((entry, index) => {
                const bookingData = {
                    user_id: userId,
                    schedule_id: scheduleId,
                    ticket_type: ticketType,
                    seat_no: bookedSeatNum[index],
                    date: currentDate,
                    ...entry // Include passenger details
                };

                console.log('Booking Data:', bookingData); // Log booking data

                return fetch('http://localhost:3000/booking/addBooking', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookingData),
                });
            });

            const responses = await Promise.all(bookingPromises);
            const results = await Promise.all(responses.map(res => res.json()));

            const errorMessages = [];
            const successMessages = [];

            results.forEach((result, index) => {
                if (result.message) {
                    successMessages.push(result.message);
                } else {
                    errorMessages.push(`Booking for seat ${bookedSeatNum[index]} failed. Reason: ${result.error || 'Unknown error'}`);
                }
            });

            if (successMessages.length === ticketEntries.length) {
                setSuccessMessages(successMessages);
                setIsBookingComplete(true);
                setTicketEntries([]);
            } else {
                setError(errorMessages.join(', '));
                setSuccessMessages([]);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            setError('An error occurred while booking the flight.');
            setSuccessMessages([]);
        } finally {
            setLoading(false);
        }
    };

    // Countdown timer logic
    useEffect(() => {
        if (timer === 0 || isBookingComplete) {
            if (!isBookingComplete) setIsTimeExpired(true);
            return;
        }

        const intervalId = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer, isBookingComplete]);

    // Redirect to home page after time expiration
    useEffect(() => {
        if (isTimeExpired) {
            setTimeout(() => navigate('/'), 3000); // 3 seconds delay before redirect
        }
    }, [isTimeExpired, navigate]);

    return (
        <div className="submit-page">
            <h1>Submit Your Details</h1>

            {!isBookingComplete && !isTimeExpired && (
                <div className="timer">
                    <p>Time left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
                </div>
            )}

            {isTimeExpired ? (
                <div className="time-expired">
                    <h2>Time has expired! You will be redirected to the home page.</h2>
                </div>
            ) : bookedSeatNum && ticketType && scheduleId && !isBookingComplete && (
                <div className="form-container">
                    <p><strong>Scheduled ID:</strong> {scheduleId}</p>
                    <p><strong>Ticket Type:</strong> {ticketType}</p>
                    <p><strong>Booked Seats:</strong> {Array.isArray(bookedSeatNum) ? bookedSeatNum.join(', ') : bookedSeatNum}</p>

                    <h2>Submit Your Information for {bookedSeatNum.length} Passenger{bookedSeatNum.length > 1 ? 's' : ''}</h2>
                    <form onSubmit={handleSubmit}>
                        {ticketEntries.map((entry, index) => (
                            <div key={index}>
                                <h3>Passenger {index + 1}</h3>
                                {Object.keys(entry).map((key) => (
                                    <div key={key}>
                                        <label>
                                            {key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                                            <input
                                                type={key === 'dob' ? 'date' : 'text'}
                                                name={key}
                                                value={entry[key]}
                                                onChange={(e) => handleChange(e, index)}
                                                required
                                                disabled={isTimeExpired}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button type="submit" disabled={loading || isTimeExpired}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}
                    {successMessages.length > 0 && (
                        <div>
                            {successMessages.map((msg, index) => (
                                <p key={index} className="success-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isBookingComplete && (
                <div className="booking-complete">
                    <h2>Booking Completed Successfully!</h2>
                </div>
            )}
        </div>
    );
};

export default SubmitPage;
*/

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
    const [timer, setTimer] = useState(60000); // 1 minute (60000 ms)
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [isTimeExpired, setIsTimeExpired] = useState(false);

    const email = localStorage.getItem('email');
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    useEffect(() => {
        if (bookedSeatNum) {
            const initialEntries = bookedSeatNum.map(() => ({
                full_name: '',
                dob: '',
                gender: '',
                passport_number: '',
                mobile_num: '',
            }));
            setTicketEntries(initialEntries);
        }
    }, [bookedSeatNum]);

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

        if (isTimeExpired) {
            setError('Time has expired. You cannot submit the form.');
            return;
        }

        if (!isLoggedIn) {
            for (const entry of ticketEntries) {
                if (!Object.values(entry).every(field => field)) {
                    setError('Please fill in all fields for each passenger.');
                    return;
                }
            }
        }

        setError('');
        setLoading(true);

        try {
            let bookingPromises;
            if (isLoggedIn) {
                bookingPromises = bookedSeatNum.map((seat) => {
                    const bookingData = {
                        email: email ?? null, 
                        schedule_id: scheduleId,
                        seat_no: seat,
                    };

                    return fetch('http://localhost:3000/booking/addBooking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bookingData),
                    });
                });
            } else {
                bookingPromises = ticketEntries.map((entry, index) => {
                    const bookingData = {
                        full_name: entry.full_name ?? null,
                        gender: entry.gender ?? null,
                        dob: entry.dob ?? null,
                        passport_number: entry.passport_number ?? null,
                        mobile_num: entry.mobile_num ?? null,
                        schedule_id: scheduleId,
                        seat_no: bookedSeatNum[index],
                    };

                    return fetch('http://localhost:3000/booking/addBooking', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(bookingData),
                    });
                });
            }

            const responses = await Promise.all(bookingPromises);
            const errorMessages = [];
            const successMessages = [];

            for (const res of responses) {
                if (!res.ok) {
                    const result = await res.json();
                    errorMessages.push(result.message || `Booking failed for one or more passengers.`);
                } else {
                    const result = await res.json();
                    successMessages.push(result.message || 'Booking succeeded for one or more passengers.');
                }
            }

            if (errorMessages.length > 0) {
                setError(errorMessages.join(', '));
                setSuccessMessages([]);
            } else {
                setSuccessMessages(successMessages);
                setIsBookingComplete(true);
                setTicketEntries([]);
            }
        } catch (error) {
            console.error('Error during booking:', error);
            setError('An error occurred while booking the flight. Please check your input and try again.');
            setSuccessMessages([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timer === 0 || isBookingComplete) {
            if (!isBookingComplete) setIsTimeExpired(true);
            return;
        }

        const intervalId = setInterval(() => {
            setTimer(prev => prev - 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, [timer, isBookingComplete]);

    useEffect(() => {
        if (isTimeExpired) {
            setTimeout(() => navigate('/'), 3000); 
        }
    }, [isTimeExpired, navigate]);

    return (
        <div className="submit-page">
            <h1>Submit Your Details</h1>

            {!isBookingComplete && !isTimeExpired && (
                <div className="timer">
                    <p>Time left: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}</p>
                </div>
            )}

            {isTimeExpired ? (
                <div className="time-expired">
                    <h2>Time has expired! You will be redirected to the home page.</h2>
                </div>
            ) : bookedSeatNum && ticketType && scheduleId && !isBookingComplete && (
                <div className="form-container">
                    <p><strong>Scheduled ID:</strong> {scheduleId}</p>
                    <p><strong>Ticket Type:</strong> {ticketType}</p>
                    <p><strong>Booked Seats:</strong> {Array.isArray(bookedSeatNum) ? bookedSeatNum.join(', ') : bookedSeatNum}</p>

                    <h2>Submit Your Information for {bookedSeatNum.length} Passenger{bookedSeatNum.length > 1 ? 's' : ''}</h2>
                    <form onSubmit={handleSubmit}>
                        {!isLoggedIn && ticketEntries.map((entry, index) => (
                            <div key={index}>
                                <h3>Passenger {index + 1}</h3>
                                {Object.keys(entry).map((key) => (
                                    <div key={key}>
                                        <label>
                                            {key.replace('_', ' ').replace(/\b\w/g, char => char.toUpperCase())}:
                                            <input
                                                type={key === 'dob' ? 'date' : 'text'}
                                                name={key}
                                                value={entry[key]}
                                                onChange={(e) => handleChange(index, e)}
                                                required
                                                disabled={isTimeExpired}
                                            />
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ))}
                        <button type="submit" disabled={loading || isTimeExpired}>
                            {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </form>

                    {error && <p className="error-message">{error}</p>}
                    {successMessages.length > 0 && (
                        <div>
                            {successMessages.map((msg, index) => (
                                <p key={index} className="success-message">{msg}</p>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {isBookingComplete && (
                <div className="booking-complete">
                    <h2>Booking Completed Successfully!</h2>
                </div>
            )}
        </div>
    );
};

export default SubmitPage;