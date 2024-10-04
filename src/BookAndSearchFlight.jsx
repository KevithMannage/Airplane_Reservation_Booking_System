import React, { useState, useEffect } from 'react';
import './BookAndSearchFlight.css';

const BookAndSearchFlight = () => {
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    checkIn: '',
    guests: 1,
  });

  const [results, setResults] = useState([]); // State to hold search results
  const [loading, setLoading] = useState(false); // State to show loading
  const [error, setError] = useState(''); // State to hold error messages
  const [triggerSearch, setTriggerSearch] = useState(false); // Trigger useEffect for fetching data
  const [flightDetails, setFlightDetails] = useState(null); // State for flight details
  const [aircraftDetails, setAircraftDetails] = useState(null); // State for aircraft details

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Reset error message
    setResults([]); // Clear previous results
    setFlightDetails(null); // Clear flight details when a new search is initiated
    setAircraftDetails(null); // Clear aircraft details when a new search is initiated
    setTriggerSearch(true); // Trigger search in useEffect
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, checkIn } = search;

      // Input validation
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

        // Since the flight data is in the first element of the returned array, access it like this:
        const flightData = data[0];

        if (Array.isArray(flightData) && flightData.length > 0) {
          setResults(flightData); // Store the fetched data in the results state
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
      setTriggerSearch(false); // Reset trigger to avoid continuous fetching
    }
  }, [triggerSearch, search]);

  const handleViewDetails = async (flight) => {
    try {
      // Fetch flight details
      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      setFlightDetails(flightData); // Store the detailed flight data

      // Fetch aircraft details using the aircraft_id
      const aircraftResponse = await fetch(`http://localhost:3000/aircraft/${flightData.aircraft_id}`);
      if (!aircraftResponse.ok) {
        throw new Error('Failed to fetch aircraft details');
      }
      const aircraftData = await aircraftResponse.json();
      setAircraftDetails(aircraftData); // Store the aircraft details
    } catch (error) {
      setError('Failed to fetch flight or aircraft details.');
    }
  };

  return (
    <div className="app">
      {/* Search Form */}
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
        {error && <p className="error">{error}</p>} {/* Display error messages */}
      </section>

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Display search results */}
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

      {/* Display flight details if available */}
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
          <p><strong>Economy Price:</strong> ${flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> ${flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> ${flightDetails.platinum_price}</p>
        </section>
      )}

      {/* Display aircraft details if available */}
      {aircraftDetails && (
        <section className="aircraft-details">
          <h2>Aircraft Details</h2>
          <p><strong>Aircraft ID:</strong> {aircraftDetails.id}</p>
          <p><strong>Aircraft Type:</strong> {aircraftDetails.type}</p>
          {/* Add more aircraft details as needed */}
        </section>
      )}

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <h2>Featured Destinations</h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <img src="/paris.jpg" alt="Destination" />
            <h3>Paris</h3>
          </div>
          <div className="destination-card">
            <img src="/maldives.jpg" alt="Destination" />
            <h3>Maldives</h3>
          </div>
          <div className="destination-card">
            <img src="/Switzerland.jpg" alt="Destination" />
            <h3>Switzerland</h3>
          </div>
          <div className="destination-card">
            <img src="/srilanka.jpg" alt="Destination" />
            <h3>Sri Lanka</h3>
          </div>
          <div className="destination-card">
            <img src="/malaysia.jpg" alt="Destination" />
            <h3>Malaysia</h3>
          </div>
          <div className="destination-card">
            <img src="/australia.jpg" alt="Destination" />
            <h3>Australia</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookAndSearchFlight;
