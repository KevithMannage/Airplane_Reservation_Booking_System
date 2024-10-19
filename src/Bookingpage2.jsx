import React, { useState, useEffect } from 'react';
import './BookAndSearchFlight.css';
import { useNavigate } from 'react-router-dom';
import './BookingPage2.css';

const Bookingpage2 = () => {
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    checkIn: '',
    guests: 1,
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
      const { source, destination, checkIn } = search;

      if (!source || !destination || !checkIn) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:3000/schedule/flight/future?from=${source}&to=${destination}`
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
            name="checkIn"
            placeholder="Check-in Date"
            value={search.checkIn}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="guests"
            placeholder="Number of Guests"
            value={search.guests}
            min="1"
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
        

    {/* Display ticket prices */}
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
