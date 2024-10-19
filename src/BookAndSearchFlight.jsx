import React, { useState, useEffect } from 'react';
import './BookAndSearchFlight.css';

const BookAndSearchFlight = () => {
  const [search, setSearch] = useState({
    source: '',
    destination: '',
    startDate: '',  // New field for start date
    endDate: '',    // New field for end date
  });

  const [results, setResults] = useState([]); // State to hold search results
  const [loading, setLoading] = useState(false); // State to show loading
  const [error, setError] = useState(''); // State to hold error messages
  const [triggerSearch, setTriggerSearch] = useState(false); // Trigger useEffect for fetching data
  const [flightDetails, setFlightDetails] = useState(null); // State for flight details

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
    setTriggerSearch(true); // Trigger search in useEffect
  };

  useEffect(() => {
    const fetchData = async () => {
      const { source, destination, startDate, endDate } = search;

      // Input validation
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
        const flightData = data[0]; // Access the first element of the returned array

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
      // Fetch flight details using schedule_id
      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      console.log(flightData); // Log flight details to console
      setFlightDetails(flightData); // Store the detailed flight data
    } catch (error) {
      setError('Failed to fetch flight details.');
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
        {error && <p className="error">{error}</p>} {/* Display error messages */}
      </section>

      {/* Show loading state */}
      {loading && <p>Loading...</p>}

      {/* Display search results */}
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

      {/* Display flight details if available */}
      {flightDetails && (
        <section className="flight-details">
          <h2>Flight Details</h2>
          <p><strong>Flight Number:</strong> {flightDetails.flight_number}</p>
          <p><strong>Departure Time:</strong> {new Date(flightDetails.departure_time).toLocaleString()}</p>
          <p><strong>Arrival Time:</strong> {new Date(flightDetails.arrival_time).toLocaleString()}</p>
          <p><strong>Economy Price:</strong> ${flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> ${flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> ${flightDetails.platinum_price}</p>
          <p><strong>Status:</strong> {flightDetails.status}</p>
          {/* Add more details as needed */}
        </section>
      )}

      {/* Featured Destinations */}
      <section className="featured-destinations">
        <h2>Featured Destinations</h2>
        <div className="destinations-grid">
          <div className="destination-card">
            <img src="/paris.jpg" alt="Paris" />
            <h3>Paris</h3>
          </div>
          <div className="destination-card">
            <img src="/maldives.jpg" alt="Maldives" />
            <h3>Maldives</h3>
          </div>
          <div className="destination-card">
            <img src="/Switzerland.jpg" alt="Switzerland" />
            <h3>Switzerland</h3>
          </div>
          <div className="destination-card">
            <img src="/srilanka.jpg" alt="Sri Lanka" />
            <h3>Sri Lanka</h3>
          </div>
          <div className="destination-card">
            <img src="/malaysia.jpg" alt="Malaysia" />
            <h3>Malaysia</h3>
          </div>
          <div className="destination-card">
            <img src="/australia.jpg" alt="Australia" />
            <h3>Australia</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BookAndSearchFlight;
