
import { useEffect, useState } from 'react';
import './BookAndSearchFlight.css';

const BookAndSearchFlight = () => {
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

  const [sourceSuggestions, setSourceSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);

  const mockSuggestions = [
    { code: 'CGK', name: 'Soekarno–Hatta International Airport, Jakarta' },
    { code: 'DPS', name: ' Ngurah Rai International Airport, Denpasar (Bali)' },
    { code: 'SUB', name: 'Juanda International Airport, Surabaya' },
    { code: 'KNO', name: ' Kualanamu International Airport, Medan' },
    { code: 'JOG', name: ' Adisutjipto International Airport, Yogyakarta' },
    { code: 'UPG', name: 'Sultan Hasanuddin International Airport, Makassar' },
    { code: 'BPN', name: 'Sultan Aji Muhammad Sulaiman Airport, Balikpapan' },
    { code: 'BIA', name: ' Bandaranaike International Airport, Colombo, Sri Lanka' },
    { code: 'HRI', name: 'Mattala Rajapaksa International Airport, Hambantota, Sri Lanka' },
    { code: 'DEL', name: ' Indira Gandhi International Airport, Delhi, India' },
    { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport, Mumbai, India' },
    { code: 'MAA', name: ' Chennai International Airport, Chennai, India' },
    { code: 'SIN', name: 'Singapore Changi Airport, Singapore' },
    { code: 'BKK', name: 'Suvarnabhumi Airport, Bangkok, Thailand' },
    { code: 'DMK', name: 'Don Mueang International Airport, Bangkok, Thailand' },
  ];

  const fetchSourceSuggestions = (query) => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter((airport) =>
        airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setSourceSuggestions(filtered);
    } else {
      setSourceSuggestions([]);
    }
  };

  const fetchDestinationSuggestions = (query) => {
    if (query.length > 0) {
      const filtered = mockSuggestions.filter((airport) =>
        airport.name.toLowerCase().includes(query.toLowerCase())
      );
      setDestinationSuggestions(filtered);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });

    if (name === 'source') {
      fetchSourceSuggestions(value);
    } else if (name === 'destination') {
      fetchDestinationSuggestions(value);
    }
  };

  const handleSuggestionClick = (name, suggestion) => {
    setSearch({ ...search, [name]: suggestion.code }); // Set the airport code instead of the name
    if (name === 'source') {
      setSourceSuggestions([]);
    } else if (name === 'destination') {
      setDestinationSuggestions([]);
    }
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
        console.log(flightData);

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
      const flightResponse = await fetch(`http://localhost:3000/schedule/flight/${flight.schedule_id}`);
      if (!flightResponse.ok) {
        throw new Error('Failed to fetch flight details');
      }
      const flightData = await flightResponse.json();
      console.log(flightData); 
      setFlightDetails(flightData);
    } catch (error) {
      setError('Failed to fetch flight details.');
    }
  };


  const highlightText = (text, query) => {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} style={{ color: 'blue' }}>{part}</strong>
      ) : part
    );
  };

  return (
    <div className="app1">
      <section className="search-form">
        <h2>Find Your Next Flight</h2>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            name="source"
            placeholder="Enter source airport"
            value={search.source}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <input
            type="text"
            name="destination"
            placeholder="Enter destination airport"
            value={search.destination}
            onChange={handleInputChange}
            autoComplete="off"
          />
          <input
            type="date"
            name="startDate"
            value={search.startDate}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="endDate"
            value={search.endDate}
            onChange={handleInputChange}
          />
          <button type="submit" className="btn">Search</button>
        </form>
        {error && <p className="error">{error}</p>}
      </section>

      {loading && <p>Loading...</p>}

      <div className="suggestions-container">
        {sourceSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {sourceSuggestions.map((suggestion) => (
              <li
                key={suggestion.code}
                onClick={() => handleSuggestionClick('source', suggestion)}
              >
                {highlightText(suggestion.name, search.source)} ({suggestion.code})
              </li>
            ))}
          </ul>
        )}
        {destinationSuggestions.length > 0 && (
          <ul className="suggestions-list">
            {destinationSuggestions.map((suggestion) => (
              <li
                key={suggestion.code}
                onClick={() => handleSuggestionClick('destination', suggestion)}
              >
                {highlightText(suggestion.name, search.destination)} ({suggestion.code})
              </li>
            ))}
          </ul>
        )}
      </div>

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
          <p><strong>Departure Time:</strong> {new Date(flightDetails.departure_time).toLocaleString()}</p>
          <p><strong>Arrival Time:</strong> {new Date(flightDetails.arrival_time).toLocaleString()}</p>
          <p><strong>Economy Price:</strong> $ {flightDetails.economy_price}</p>
          <p><strong>Business Price:</strong> ${flightDetails.business_price}</p>
          <p><strong>Platinum Price:</strong> ${flightDetails.platinum_price}</p>
          <p><strong>Status:</strong> {flightDetails.status}</p>
        </section>
      )}

 
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