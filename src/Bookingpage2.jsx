/*import React, { useState, useEffect } from 'react';
import './BookAndSearchFlight.css';
import { useNavigate } from 'react-router-dom';
import './BookingPage2.css';

const Bookingpage2 = () => {
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    startDate: '',  // New field for start date
    endDate: '',    // New field for end date
    currentDate: new Date().toISOString().split('T')[0],
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [economySeats, setEconomySeats] = useState([]);
  const [businessSeats, setBusinessSeats] = useState([]);
  const [platinumSeats, setPlatinumSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [ticketType, setTicketType] = useState('Economy');
  const navigate = useNavigate();
  const user_id = localStorage.getItem('user_id') || null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setFlightDetails(null);
    setEconomySeats([]);
    setBusinessSeats([]);
    setPlatinumSeats([]);
    setSelectedSeats([]);
    setTriggerSearch(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, startDate, endDate  } = search;

      if (!source || !destination || !startDate||!endDate) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/schedule/flight/daterange?start=${startDate}&end=${endDate}&from=${source}&to=${destination}`
        );

        if (!response.ok) {
          throw new Error('Error fetching flight data');
        }

        const data = await response.json();
        const flightData = data[0];

        if (Array.isArray(flightData) && flightData.length > 0) {
          setResults(flightData);
        } else {
          setError('No flights found for the selected criteria.');
        }
      } catch (error) {
        setError('Failed to fetch flight data.');
      } finally {
        setLoading(false);
      }
    };

    if (triggerSearch) {
      fetchData();
      setTriggerSearch(false);
    }
  }, [triggerSearch, search]);

  const handleViewDetails = async (flight) => {
    try {
      setSelectedScheduleId(flight.schedule_id);
      setLoadingSeats(true);

      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      setFlightDetails(flightData);

      const fetchSeatsForClass = async (ticketType) => {
        const seatResponse = await fetch(
          `http://localhost:3000/booking/getseats?schedule_id=${flight.schedule_id}&ticket_type=${ticketType}`
        );
        if (!seatResponse.ok) {
          throw new Error('Failed to fetch seat details');
        }
        return seatResponse.json();
      };

      const economySeats = await fetchSeatsForClass('Economy');
      const businessSeats = await fetchSeatsForClass('Business');
      const platinumSeats = await fetchSeatsForClass('Platinum');

      setEconomySeats(economySeats);
      setBusinessSeats(businessSeats);
      setPlatinumSeats(platinumSeats);
    } catch (error) {
      setError('Failed to fetch flight or seat details.');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      } else if (prevSeats.length < ticketCount) {
        return [...prevSeats, seatNumber];
      }
      return prevSeats;
    });
  };

  const handleProceed = async () => {
    if (!selectedScheduleId || selectedSeats.length === 0) {
      alert('Please select a flight and seat.');
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const reservationDetails = {
          schedule_id: selectedScheduleId,
          seat_no: seat,
          ticket_type: ticketType,
        };

        const response = await fetch('http://localhost:3000/booking/addReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationDetails),
        });

        if (!response.ok) {
          throw new Error('Failed to add reservation for seat: ' + seat);
        }
      }

      console.log('All reservations added successfully');
      navigate('/submit-details', {
        state: {
          bookedSeatNum: selectedSeats,
          ticketType: ticketType,
          scheduleId: selectedScheduleId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error while making reservations: ' + error.message);
    }
  };

  return (
    <div className="app">
            <section className="search-form">
        <h2>Find Your Next Flight</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="source"
            placeholder="Enter source airport"
            value={search.source}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={search.destination}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"  // New input for start date
            placeholder="Start Date"
            value={search.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"  // New input for end date
            placeholder="End Date"
            value={search.endDate}
            onChange={handleInputChange}
          />
         
          <button type="submit" className="btn">Search</button>
        </form>
      </section>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <section className="search-results">
          <h2>Available Flights</h2>
          <ul>
            {results.map((flight, index) => (
              <li key={index} className="flight-item">
                <span className="flight-number">{flight.flight_no}</span>
                <span className="flight-date">{new Date(flight.date_time).toLocaleDateString()}</span>
                <span className="flight-time">{new Date(flight.date_time).toLocaleTimeString()}</span>
                <button className="view-details-btn" onClick={() => handleViewDetails(flight)}>View Details</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {flightDetails && (
        <section className="flight-details">
          <h2>Flight Details</h2>
          <p><strong>Flight Number:</strong> {flightDetails.flight_no}</p>
          <p><strong>Source:</strong> {flightDetails.source_airport_code}</p>
          <p><strong>Destination:</strong> {flightDetails.destination_airport_code}</p>
          <p><strong>Date & Time:</strong> {new Date(flightDetails.date_time).toLocaleString()}</p>
        

    <h3>Ticket Prices</h3>
    <p><strong>Economy Price:</strong> ${flightDetails.economy_price}</p>
    <p><strong>Business Price:</strong> ${flightDetails.business_price}</p>
    <p><strong>Platinum Price:</strong> ${flightDetails.platinum_price}</p>
          <h3>Select Number of Tickets</h3>
          <input
            type="number"
            value={ticketCount}
            min="1"
            max="5"
            onChange={(e) => setTicketCount(Number(e.target.value))}
          />

          <h1>Select Your Seat</h1>

          {loadingSeats ? (
  <p>Loading seats...</p>
) : (
  <>
    <div className="seat-section">
      <h2>Economy Seats</h2>
      {economySeats.length === 0 ? (
        <p>No Economy seats available.</p>
      ) : (
        <div className="seats">
          {economySeats.map((seat) => (
            <div
              key={seat}
              className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat}
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="seat-section">
      <h2>Business Seats</h2>
      {businessSeats.length === 0 ? (
        <p>No Business seats available.</p>
      ) : (
        <div className="seats">
          {businessSeats.map((seat) => (
            <div
              key={seat}
              className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat}
            </div>
          ))}
        </div>
      )}
    </div>

    <div className="seat-section">
      <h2>Platinum Seats</h2>
      {platinumSeats.length === 0 ? (
        <p>No Platinum seats available.</p>
      ) : (
        <div className="seats">
          {platinumSeats.map((seat) => (
            <div
              key={seat}
              className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
              onClick={() => handleSeatClick(seat)}
            >
              {seat}
            </div>
          ))}
        </div>
      )}
    </div>
  </>
)}


      {(economySeats.length > 0 || businessSeats.length > 0 || platinumSeats.length > 0) && (
            <button className="proceed-btn" onClick={handleProceed}>Proceed</button>
          )}
        </section>
      )}
    </div>
  );
};

export default Bookingpage2;
*/

/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './BookAndSearchFlight.css';
import './BookingPage2.css';

const Bookingpage2 = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null);
  const [economySeats, setEconomySeats] = useState([]);
  const [businessSeats, setBusinessSeats] = useState([]);
  const [platinumSeats, setPlatinumSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketType, setTicketType] = useState('Economy');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setFlightDetails(null);
    setTriggerSearch(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, startDate, endDate } = search;

      if (!source || !destination || !startDate || !endDate) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/schedule/flight/daterange?start=${startDate}&end=${endDate}&from=${source}&to=${destination}`
        );

        if (!response.ok) {
          throw new Error('Error fetching flight data');
        }

        const data = await response.json();
        const flightData = data[0];

        if (Array.isArray(flightData) && flightData.length > 0) {
          setResults(flightData);
        } else {
          setError('No flights found for the selected criteria.');
        }
      } catch (error) {
        setError('Failed to fetch flight data.');
      } finally {
        setLoading(false);
      }
    };

    if (triggerSearch) {
      fetchData();
      setTriggerSearch(false);
    }
  }, [triggerSearch, search]);

  const handleViewDetails = async (flight) => {
    try {
      setSelectedScheduleId(flight.schedule_id);
      setLoadingSeats(true);

      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      setFlightDetails(flightData);

      const fetchSeatsForClass = async (ticketType) => {
        const seatResponse = await fetch(
          `http://localhost:3000/booking/getseats?schedule_id=${flight.schedule_id}&ticket_type=${ticketType}`
        );
        if (!seatResponse.ok) {
          throw new Error('Failed to fetch seat details');
        }
        return seatResponse.json();
      };

      const economySeats = await fetchSeatsForClass('Economy');
      const businessSeats = await fetchSeatsForClass('Business');
      const platinumSeats = await fetchSeatsForClass('Platinum');

      setEconomySeats(economySeats);
      setBusinessSeats(businessSeats);
      setPlatinumSeats(platinumSeats);
    } catch (error) {
      setError('Failed to fetch flight or seat details.');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      } else if (prevSeats.length < ticketCount) {
        return [...prevSeats, seatNumber];
      }
      return prevSeats;
    });
  };

  const handleProceed = async () => {
    if (!selectedScheduleId || selectedSeats.length === 0) {
      alert('Please select a flight and seat.');
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const reservationDetails = {
          schedule_id: selectedScheduleId,
          seat_no: seat,
        };

        const response = await fetch('http://localhost:3000/booking/addReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationDetails),
        });

        if (!response.ok) {
          throw new Error('Failed to add reservation for seat: ' + seat);
        }
      }

      console.log('All reservations added successfully');
      
      // Navigate to the submit-details page after successful reservation
      navigate('/submit-details', {
        state: {
          bookedSeatNum: selectedSeats,
          ticketType: ticketType,
          scheduleId: selectedScheduleId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error while making reservations: ' + error.message);
    }
  };

  return (
    <div className="app">
      <section className="search-form">
        <h2>Find Your Next Flight</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="source"
            placeholder="Enter source airport"
            value={search.source}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={search.destination}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={search.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={search.endDate}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn">Search</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <section className="search-results">
          <h2>Available Flights</h2>
          <ul>
            {results.map((flight) => (
              <li key={flight.schedule_id} className="flight-item">
                <span className="flight-number">{flight.flight_number}</span>
                <span className="flight-date">{new Date(flight.departure_time).toLocaleDateString()}</span>
                <span className="flight-time">{new Date(flight.departure_time).toLocaleTimeString()}</span>
                <button className="view-details-btn" onClick={() => handleViewDetails(flight)}>View Details</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {flightDetails && (
        <section className="flight-details">
          <h2>Flight Details</h2>
          <p><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
          <p><strong>Source:</strong> {search.source}</p>
          <p><strong>Destination:</strong> {search.destination}</p>
          <p><strong>Departure Time:</strong> {new Date(flightDetails.departure_time).toLocaleString()}</p>
          <p><strong>Arrival Time:</strong> {new Date(flightDetails.arrival_time).toLocaleString()}</p>

          <h3>Ticket Prices</h3>
          <p><strong>Economy Price:</strong> ${flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> ${flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> ${flightDetails.platinum_price}</p>

          <h3>Select Number of Tickets</h3>
          <input
            type="number"
            value={ticketCount}
            min="1"
            max="5"
            onChange={(e) => setTicketCount(Number(e.target.value))}
          />

          <h1>Select Your Seat</h1>

          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : (
            <>
              <div className="seat-section">
                <h2>Economy Seats</h2>
                {economySeats.length === 0 ? (
                  <p>No Economy seats available.</p>
                ) : (
                  <div className="seats">
                    {economySeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="seat-section">
                <h2>Business Seats</h2>
                {businessSeats.length === 0 ? (
                  <p>No Business seats available.</p>
                ) : (
                  <div className="seats">
                    {businessSeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="seat-section">
                <h2>Platinum Seats</h2>
                {platinumSeats.length === 0 ? (
                  <p>No Platinum seats available.</p>
                ) : (
                  <div className="seats">
                    {platinumSeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button className="proceed-btn" onClick={handleProceed}>Proceed to Booking</button>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Bookingpage2;
*/

/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './BookAndSearchFlight.css';
import './BookingPage2.css';

const Bookingpage2 = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null);
  const [economySeats, setEconomySeats] = useState([]);
  const [businessSeats, setBusinessSeats] = useState([]);
  const [platinumSeats, setPlatinumSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketType, setTicketType] = useState('Economy');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setFlightDetails(null);
    setTriggerSearch(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, startDate, endDate } = search;

      if (!source || !destination || !startDate || !endDate) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/schedule/flight/daterange?start=${startDate}&end=${endDate}&from=${source}&to=${destination}`
        );

        if (!response.ok) {
          throw new Error('Error fetching flight data');
        }

        const data = await response.json();
        const flightData = data[0];

        if (Array.isArray(flightData) && flightData.length > 0) {
          setResults(flightData);
        } else {
          setError('No flights found for the selected criteria.');
        }
      } catch (error) {
        setError('Failed to fetch flight data.');
      } finally {
        setLoading(false);
      }
    };

    if (triggerSearch) {
      fetchData();
      setTriggerSearch(false);
    }
  }, [triggerSearch, search]);

  const handleViewDetails = async (flight) => {
    try {
      setSelectedScheduleId(flight.schedule_id);
      setLoadingSeats(true);

      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      setFlightDetails(flightData);

      const fetchSeatsForClass = async (ticketType) => {
        const seatResponse = await fetch(
          `http://localhost:3000/booking/getseats?schedule_id=${flight.schedule_id}&ticket_type=${ticketType}`
        );
        if (!seatResponse.ok) {
          throw new Error('Failed to fetch seat details');
        }
        return seatResponse.json();
      };

      // Fetch seats and set them for each class
      const economyResponse = await fetchSeatsForClass('Economy');
      const businessResponse = await fetchSeatsForClass('Business');
      const platinumResponse = await fetchSeatsForClass('Platinum');

      setEconomySeats(economyResponse.seats || []);
      setBusinessSeats(businessResponse.seats || []);
      setPlatinumSeats(platinumResponse.seats || []);
    } catch (error) {
      setError('Failed to fetch flight or seat details.');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      } else if (prevSeats.length < ticketCount) {
        return [...prevSeats, seatNumber];
      }
      return prevSeats;
    });
  };

  const handleProceed = async () => {
    if (!selectedScheduleId || selectedSeats.length === 0) {
      alert('Please select a flight and seat.');
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const reservationDetails = {
          schedule_id: selectedScheduleId,
          seat_no: seat,
        };

        const response = await fetch('http://localhost:3000/booking/addReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationDetails),
        });

        if (!response.ok) {
          throw new Error('Failed to add reservation for seat: ' + seat);
        }
      }

      console.log('All reservations added successfully');

      // Navigate to the submit-details page after successful reservation
      navigate('/submit-details', {
        state: {
          bookedSeatNum: selectedSeats,
          ticketType: ticketType,
          scheduleId: selectedScheduleId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error while making reservations: ' + error.message);
    }
  };

  return (
    <div className="app">
      <section className="search-form">
        <h2>Find Your Next Flight</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="source"
            placeholder="Enter source airport"
            value={search.source}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={search.destination}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={search.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={search.endDate}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn">Search</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <section className="search-results">
          <h2>Available Flights</h2>
          <ul>
            {results.map((flight) => (
              <li key={flight.schedule_id} className="flight-item">
                <span className="flight-number">{flight.flight_number}</span>
                <span className="flight-date">{new Date(flight.departure_time).toLocaleDateString()}</span>
                <span className="flight-time">{new Date(flight.departure_time).toLocaleTimeString()}</span>
                <button className="view-details-btn" onClick={() => handleViewDetails(flight)}>View Details</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {flightDetails && (
        <section className="flight-details">
          <h2>Flight Details</h2>
          <p><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
          <p><strong>Source:</strong> {search.source}</p>
          <p><strong>Destination:</strong> {search.destination}</p>
          <p><strong>Departure Time:</strong> {new Date(flightDetails.departure_time).toLocaleString()}</p>
          <p><strong>Arrival Time:</strong> {new Date(flightDetails.arrival_time).toLocaleString()}</p>

          <h3>Ticket Prices</h3>
          <p><strong>Economy Price:</strong> ${flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> ${flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> ${flightDetails.platinum_price}</p>

          <h3>Select Number of Tickets</h3>
          <input
            type="number"
            value={ticketCount}
            min="1"
            max="5"
            onChange={(e) => setTicketCount(Number(e.target.value))}
          />

          <h1>Select Your Seat</h1>

          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : (
            <>
              <div className="seat-section">
                <h2>Economy Seats</h2>
                {economySeats.length === 0 ? (
                  <p>No Economy seats available.</p>
                ) : (
                  <div className="seats">
                    {economySeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="seat-section">
                <h2>Business Seats</h2>
                {businessSeats.length === 0 ? (
                  <p>No Business seats available.</p>
                ) : (
                  <div className="seats">
                    {businessSeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="seat-section">
                <h2>Platinum Seats</h2>
                {platinumSeats.length === 0 ? (
                  <p>No Platinum seats available.</p>
                ) : (
                  <div className="seats">
                    {platinumSeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleProceed} className="btn">Proceed to Payment</button>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Bookingpage2;
*/

/*
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './BookAndSearchFlight.css';
import './BookingPage2.css';

const Bookingpage2 = () => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null);
  const [economySeats, setEconomySeats] = useState([]);
  const [businessSeats, setBusinessSeats] = useState([]);
  const [platinumSeats, setPlatinumSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketType, setTicketType] = useState('Economy');
  const [maxSeats, setMaxSeats] = useState({
    Economy: 0,
    Business: 0,
    Platinum: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setFlightDetails(null);
    setTriggerSearch(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, startDate, endDate } = search;

      if (!source || !destination || !startDate || !endDate) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/schedule/flight/daterange?start=${startDate}&end=${endDate}&from=${source}&to=${destination}`
        );

        if (!response.ok) {
          throw new Error('Error fetching flight data');
        }

        const data = await response.json();
        const flightData = data[0];

        if (Array.isArray(flightData) && flightData.length > 0) {
          setResults(flightData);
        } else {
          setError('No flights found for the selected criteria.');
        }
      } catch (error) {
        setError('Failed to fetch flight data.');
      } finally {
        setLoading(false);
      }
    };

    if (triggerSearch) {
      fetchData();
      setTriggerSearch(false);
    }
  }, [triggerSearch, search]);

  const handleViewDetails = async (flight) => {
    try {
      setSelectedScheduleId(flight.schedule_id);
      setLoadingSeats(true);

      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      setFlightDetails(flightData);

      const fetchSeatsForClass = async (ticketType) => {
        const seatResponse = await fetch(
          `http://localhost:3000/booking/getseats?schedule_id=${flight.schedule_id}&ticket_type=${ticketType}`
        );
        if (!seatResponse.ok) {
          throw new Error('Failed to fetch seat details');
        }
        return seatResponse.json();
      };

      // Fetch seats and maxSeats for each class
      const economyResponse = await fetchSeatsForClass('Economy');
      const businessResponse = await fetchSeatsForClass('Business');
      const platinumResponse = await fetchSeatsForClass('Platinum');

      setEconomySeats(economyResponse.seats || []);
      setBusinessSeats(businessResponse.seats || []);
      setPlatinumSeats(platinumResponse.seats || []);

      // Set the maximum seats for each class
      setMaxSeats({
        Economy: economyResponse.maxSeats || 0,
        Business: businessResponse.maxSeats || 0,
        Platinum: platinumResponse.maxSeats || 0,
      });
    } catch (error) {
      setError('Failed to fetch flight or seat details.');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      } else if (prevSeats.length < ticketCount) {
        return [...prevSeats, seatNumber];
      }
      return prevSeats;
    });
  };

  const handleProceed = async () => {
    if (!selectedScheduleId || selectedSeats.length === 0) {
      alert('Please select a flight and seat.');
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const reservationDetails = {
          schedule_id: selectedScheduleId,
          seat_no: seat,
        };

        const response = await fetch('http://localhost:3000/booking/addReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationDetails),
        });

        if (!response.ok) {
          throw new Error('Failed to add reservation for seat: ' + seat);
        }
      }

      console.log('All reservations added successfully');

      // Navigate to the submit-details page after successful reservation
      navigate('/submit-details', {
        state: {
          bookedSeatNum: selectedSeats,
          ticketType: ticketType,
          scheduleId: selectedScheduleId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error while making reservations: ' + error.message);
    }
  };

  // Generate all seat numbers based on maxSeats for each ticket type
  const generateAllSeats = (maxSeatCount) => {
    return Array.from({ length: maxSeatCount }, (_, index) => `E${index + 1}`);
  };

  const allEconomySeats = generateAllSeats(maxSeats.Economy);
  const allBusinessSeats = generateAllSeats(maxSeats.Business);
  const allPlatinumSeats = generateAllSeats(maxSeats.Platinum);

  const getUnavailableSeats = (availableSeats, allSeats) => {
    return allSeats.filter(seat => !availableSeats.includes(seat));
  };

  const unavailableEconomySeats = getUnavailableSeats(economySeats, allEconomySeats);
  const unavailableBusinessSeats = getUnavailableSeats(businessSeats, allBusinessSeats);
  const unavailablePlatinumSeats = getUnavailableSeats(platinumSeats, allPlatinumSeats);

  return (
    <div className="app">
      <section className="search-form">
        <h2>Find Your Next Flight</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="source"
            placeholder="Enter source airport"
            value={search.source}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={search.destination}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={search.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={search.endDate}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn">Search</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <section className="search-results">
          <h2>Available Flights</h2>
          <ul>
            {results.map((flight) => (
              <li key={flight.schedule_id} className="flight-item">
                <span className="flight-number">{flight.flight_number}</span>
                <span className="flight-date">{new Date(flight.departure_time).toLocaleDateString()}</span>
                <span className="flight-time">{new Date(flight.departure_time).toLocaleTimeString()}</span>
                <button className="view-details-btn" onClick={() => handleViewDetails(flight)}>View Details</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {flightDetails && (
        <section className="flight-details">
          <h2>Flight Details</h2>
          <p><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
          <p><strong>Economy Price:</strong> {flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> {flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> {flightDetails.platinum_price}</p>

          {loadingSeats && <p>Loading seats...</p>}
          {!loadingSeats && (
            <>
              <h2>Select Your Seats</h2>

              <div className="seat-section">
                <h2>Economy Seats</h2>
                {economySeats.length === 0 ? (
                  <p>No Economy seats available.</p>
                ) : (
                  <div className="seats">
                    {economySeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                    {unavailableEconomySeats.map((seat) => (
                      <button
                        key={seat}
                        className="seat unavailable"
                        style={{ backgroundColor: 'white', color: 'grey' }} // Style for unavailable seats
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="seat-section">
                <h2>Business Seats</h2>
                {businessSeats.length === 0 ? (
                  <p>No Business seats available.</p>
                ) : (
                  <div className="seats">
                    {businessSeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                    {unavailableBusinessSeats.map((seat) => (
                      <button
                        key={seat}
                        className="seat unavailable"
                        style={{ backgroundColor: 'white', color: 'grey' }} // Style for unavailable seats
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="seat-section">
                <h2>Platinum Seats</h2>
                {platinumSeats.length === 0 ? (
                  <p>No Platinum seats available.</p>
                ) : (
                  <div className="seats">
                    {platinumSeats.map((seat) => (
                      <button
                        key={seat}
                        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''}`}
                        onClick={() => handleSeatClick(seat)}
                      >
                        {seat}
                      </button>
                    ))}
                    {unavailablePlatinumSeats.map((seat) => (
                      <button
                        key={seat}
                        className="seat unavailable"
                        style={{ backgroundColor: 'white', color: 'grey' }} // Style for unavailable seats
                      >
                        {seat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button onClick={handleProceed} className="btn">Proceed to Payment</button>
            </>
          )}
        </section>
      )}
    </div>
  );
};

export default Bookingpage2;

*/


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BookAndSearchFlight.css';
import './BookingPage2.css';

const Bookingpage2 = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null);
  const [economySeats, setEconomySeats] = useState([]);
  const [businessSeats, setBusinessSeats] = useState([]);
  const [platinumSeats, setPlatinumSeats] = useState([]);
  const [loadingSeats, setLoadingSeats] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [ticketType, setTicketType] = useState('Economy');
  const [maxSeats, setMaxSeats] = useState({
    Economy: 0,
    Business: 0,
    Platinum: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults([]);
    setFlightDetails(null);
    setTriggerSearch(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, startDate, endDate } = search;

      if (!source || !destination || !startDate || !endDate) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/schedule/flight/daterange?start=${startDate}&end=${endDate}&from=${source}&to=${destination}`
        );

        if (!response.ok) {
          throw new Error('Error fetching flight data');
        }

        const data = await response.json();
        const flightData = data[0];

        if (Array.isArray(flightData) && flightData.length > 0) {
          setResults(flightData);
        } else {
          setError('No flights found for the selected criteria.');
        }
      } catch (error) {
        setError('Failed to fetch flight data.');
      } finally {
        setLoading(false);
      }
    };

    if (triggerSearch) {
      fetchData();
      setTriggerSearch(false);
    }
  }, [triggerSearch, search]);

  const handleViewDetails = async (flight) => {
    try {
      setSelectedScheduleId(flight.schedule_id);
      setLoadingSeats(true);

      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      setFlightDetails(flightData);

      const fetchSeatsForClass = async (ticketType) => {
        const seatResponse = await fetch(
          `http://localhost:3000/booking/getseats?schedule_id=${flight.schedule_id}&ticket_type=${ticketType}`
        );
        if (!seatResponse.ok) {
          throw new Error('Failed to fetch seat details');
        }
        return seatResponse.json();
      };

      // Fetch seats and maxSeats for each class
      const economyResponse = await fetchSeatsForClass('Economy');
      const businessResponse = await fetchSeatsForClass('Business');
      const platinumResponse = await fetchSeatsForClass('Platinum');

      setEconomySeats(economyResponse.seats || []);
      setBusinessSeats(businessResponse.seats || []);
      setPlatinumSeats(platinumResponse.seats || []);

      // Set the maximum seats for each class
      setMaxSeats({
        Economy: economyResponse.maxSeats || 0,
        Business: businessResponse.maxSeats || 0,
        Platinum: platinumResponse.maxSeats || 0,
      });
    } catch (error) {
      setError('Failed to fetch flight or seat details.');
    } finally {
      setLoadingSeats(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      } else if (prevSeats.length < 5) { // Adjusted to allow a maximum of 5 seats
        return [...prevSeats, seatNumber];
      }
      return prevSeats;
    });
  };

  const handleProceed = async () => {
    if (!selectedScheduleId || selectedSeats.length === 0) {
      alert('Please select a flight and seat.');
      return;
    }

    try {
      for (const seat of selectedSeats) {
        const reservationDetails = {
          schedule_id: selectedScheduleId,
          seat_no: seat,
        };

        const response = await fetch('http://localhost:3000/booking/addReservation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservationDetails),
        });

        if (!response.ok) {
          throw new Error('Failed to add reservation for seat: ' + seat);
        }
      }

      console.log('All reservations added successfully');

      // Navigate to the submit-details page after successful reservation
      navigate('/submit-details', {
        state: {
          bookedSeatNum: selectedSeats,
          ticketType: ticketType,
          scheduleId: selectedScheduleId,
        },
      });
    } catch (error) {
      console.error('Error:', error);
      alert('Error while making reservations: ' + error.message);
    }
  };

  // Generate all seat numbers based on maxSeats for each ticket type
  const generateAllSeats = (maxSeatCount, prefix) => {
    return Array.from({ length: maxSeatCount }, (_, index) => `${prefix}${index + 1}`);
  };

  const allEconomySeats = generateAllSeats(maxSeats.Economy, 'E');
  const allBusinessSeats = generateAllSeats(maxSeats.Business, 'B');
  const allPlatinumSeats = generateAllSeats(maxSeats.Platinum, 'P');

  const getUnavailableSeats = (availableSeats, allSeats) => {
    return allSeats.filter(seat => !availableSeats.includes(seat));
  };

  const unavailableEconomySeats = getUnavailableSeats(economySeats, allEconomySeats);
  const unavailableBusinessSeats = getUnavailableSeats(businessSeats, allBusinessSeats);
  const unavailablePlatinumSeats = getUnavailableSeats(platinumSeats, allPlatinumSeats);

  return (
    <div className="app1">
      <section className="search-form" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        <h2>Find Your Next Flight</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="source"
            placeholder="Enter source airport"
            value={search.source}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={search.destination}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={search.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            placeholder="End Date"
            value={search.endDate}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn">Search</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      {loading && <p>Loading...</p>}

      {results.length > 0 && (
        <section className="search-results" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h2>Available Flights</h2>
          <ul>
            {results.map((flight) => (
              <li key={flight.schedule_id} className="flight-item">
                <span className="flight-number">{flight.flight_number}</span>
                <span className="flight-date">{new Date(flight.departure_time).toLocaleDateString()}</span>
                <span className="flight-time">{new Date(flight.departure_time).toLocaleTimeString()}</span>
                <button className="view-details-btn" onClick={() => handleViewDetails(flight)}>View Details</button>
              </li>
            ))}
          </ul>
        </section>
      )}

      {flightDetails && (
        <section className="flight-details" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h2>Flight Details</h2>
          <p><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
          <p><strong>Departure:</strong> {new Date(flightDetails.departure_time).toLocaleString()}</p>
          <p><strong>Arrival:</strong> {new Date(flightDetails.arrival_time).toLocaleString()}</p>
          <p><strong>Economy Price:</strong> {flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> {flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> {flightDetails.platinum_price}</p>
          <p><strong>Departure Time:</strong> {search.source}</p>
          <p><strong>Arrival Time:</strong> {search.destination}</p>
          <div className="ticket-count" style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
            <h4>Number of Tickets</h4>
            <input
              type="number"
              min="1"
              max="5"
              value={selectedSeats.length}
              readOnly
            />
          </div>

          <h3>Select Your Seats</h3>
         

<div className="seat-selection">
  <h4>Economy Seats</h4>
  <div className="seat-grid">
    {allEconomySeats.map((seat) => (
      <button
        key={seat}
        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} ${unavailableEconomySeats.includes(seat) ? 'unavailable' : ''}`}
        onClick={() => handleSeatClick(seat)}
        disabled={unavailableEconomySeats.includes(seat)}
      >
        {seat}
      </button>
    ))}
  </div>

  <h4>Business Seats</h4>
  <div className="seat-grid">
    {allBusinessSeats.map((seat) => (
      <button
        key={seat}
        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} ${unavailableBusinessSeats.includes(seat) ? 'unavailable' : ''}`}
        onClick={() => handleSeatClick(seat)}
        disabled={unavailableBusinessSeats.includes(seat)}
      >
        {seat}
      </button>
    ))}
  </div>

  <h4>Platinum Seats</h4>
  <div className="seat-grid">
    {allPlatinumSeats.map((seat) => (
      <button
        key={seat}
        className={`seat ${selectedSeats.includes(seat) ? 'selected' : ''} ${unavailablePlatinumSeats.includes(seat) ? 'unavailable' : ''}`}
        onClick={() => handleSeatClick(seat)}
        disabled={unavailablePlatinumSeats.includes(seat)}
      >
        {seat}
      </button>
    ))}
  </div>
</div>


          <button className="btn" onClick={handleProceed}>Proceed to Checkout</button>
        </section>
      )}
    </div>
  );
};

export default Bookingpage2;

