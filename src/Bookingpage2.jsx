import React, { useState, useEffect } from 'react';
import './BookAndSearchFlight.css';

const BookAndSearchFlight = () => {
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    checkIn: '',
    guests: 1,
  });

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [triggerSearch, setTriggerSearch] = useState(false);
  const [flightDetails, setFlightDetails] = useState(null);
  const [selectedScheduleId, setSelectedScheduleId] = useState(null);
  const [seats, setSeats] = useState([]); // To hold the seat numbers (e.g. ["E2", "E3"])
  const [loadingSeats, setLoadingSeats] = useState(false);
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
    setSeats([]);
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

      // Fetch seats
      const seatResponse = await fetch(
        `http://localhost:3000/booking/getseats?schedule_id=${flight.schedule_id}&ticket_type=${ticketType}`
      );
      if (!seatResponse.ok) {
        throw new Error('Failed to fetch seat details');
      }
      const seatData = await seatResponse.json();
      setSeats(seatData); // Assuming the API gives an array of seat numbers (["E2", "E3", ...])
    } catch (error) {
      setError('Failed to fetch flight or seat details.');
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    const fetchSeats = async () => {
      if (selectedScheduleId) {
        setLoadingSeats(true);
        try {
          const seatResponse = await fetch(
            `http://localhost:3000/booking/getseats?schedule_id=${selectedScheduleId}&ticket_type=${ticketType}`
          );
          if (!seatResponse.ok) {
            throw new Error('Failed to fetch seat details');
          }
          const seatData = await seatResponse.json();
          setSeats(seatData);
        } catch (error) {
          setError('Failed to fetch seat details.');
        } finally {
          setLoadingSeats(false);
        }
      }
    };

    fetchSeats();
  }, [ticketType, selectedScheduleId]);

  const handleSeatClick = (seatNumber) => {
    console.log('Selected seat:', seatNumber);
    // Add your logic for selecting a seat (e.g., updating the backend)
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
          <p><strong>Economy Seats:</strong> {flightDetails.economy_seats}</p>
          <p><strong>Business Seats:</strong> {flightDetails.business_seats}</p>
          <p><strong>Platinum Seats:</strong> {flightDetails.platinum_seats}</p>

          <h3>Select Your Seat ({ticketType})</h3>
          <select onChange={(e) => setTicketType(e.target.value)} value={ticketType}>
            <option value="Economy">Economy</option>
            <option value="Business">Business</option>
            <option value="Platinum">Platinum</option>
          </select>

          {loadingSeats ? (
            <p>Loading seats...</p>
          ) : (
            <div className="seat-selection">
              {seats.map((seatNumber, index) => (
                <button
                  key={index}
                  className="seat available"
                  onClick={() => handleSeatClick(seatNumber)}
                  style={{
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    cursor: 'pointer',
                    margin: '5px',
                    padding: '10px 15px',
                    border: 'none',
                    borderRadius: '5px',
                  }}
                >
                  {seatNumber}
                </button>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default BookAndSearchFlight;
