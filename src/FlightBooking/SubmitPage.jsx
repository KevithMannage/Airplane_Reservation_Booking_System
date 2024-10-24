
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
    const [timer, setTimer] = useState(9000); // 15 minutes
    const [isBookingComplete, setIsBookingComplete] = useState(false);
    const [isTimeExpired, setIsTimeExpired] = useState(false);

    const isLoggedIn = localStorage.getItem('isLoggedIn');

    useEffect(() => {
      if (bookedSeatNum) {
          const initialEntries = bookedSeatNum.map(() => ({
              email: '', 
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
  
      setError('');
      setLoading(true);
  
      try {
          const successMessages = [];
          const errorMessages = [];
  
          const storedEmail = localStorage.getItem('email'); 
          for (let index = 0; index < ticketEntries.length; index++) {
              const entry = ticketEntries[index];
              const bookingData = {
                email: entry.email ? entry.email : null,                  
                 full_name: entry.full_name,
                  gender: entry.gender,
                  dob: entry.dob,
                  passport_number: entry.passport_number,
                  mobile_num: entry.mobile_num,
                  schedule_id: scheduleId,
                  seat_no: bookedSeatNum[index], 
              };
  
              if (bookingData.email==storedEmail) {
                console.log(bookingData);

                  const response = await fetch('http://localhost:3000/booking/addBooking', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          email: bookingData.email,
                          schedule_id: bookingData.schedule_id,
                          seat_no: bookingData.seat_no,
                      }),
                  });
  
                  if (!response.ok) {
                      const result = await response.json();
                      errorMessages.push(result.message || `Booking failed for Passenger ${index + 1}.`);
                  } else {
                      const result = await response.json();
                      successMessages.push(result.message || `Booking succeeded for Passenger ${index + 1}.`);
                  }
              } else {
                console.log(bookingData);
                  const response = await fetch('http://localhost:3000/booking/addBooking', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                          full_name: bookingData.full_name,
                          gender: bookingData.gender,
                          dob: bookingData.dob,
                          passport_number: bookingData.passport_number,
                          mobile_num: bookingData.mobile_num,
                          schedule_id: bookingData.schedule_id,
                          seat_no: bookingData.seat_no,
                      }),
                  });
  
                  if (!response.ok) {
                      const result = await response.json();
                      errorMessages.push(result.message || `Booking failed for Passenger ${index + 1}.`);
                  } else {
                      const result = await response.json();
                      successMessages.push(result.message || `Booking succeeded for Passenger ${index + 1}.`);
                  }
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


