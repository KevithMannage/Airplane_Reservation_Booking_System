

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    { code: 'DMK', name: 'Don Mueang International Airport, Bangkok,Thailand' },
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

  const [maxSeats, setMaxSeats] = useState({
    Economy: 0,
    Business: 0,
    Platinum: 0,
  });

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
    setSearch({ ...search, [name]: suggestion.code }); 
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
      setFlightDetails(flight);
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

      const economyResponse = await fetchSeatsForClass('Economy');
      const businessResponse = await fetchSeatsForClass('Business');
      const platinumResponse = await fetchSeatsForClass('Platinum');

      setEconomySeats(economyResponse.seats || []);
      setBusinessSeats(businessResponse.seats || []);
      setPlatinumSeats(platinumResponse.seats || []);

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

  const highlightText = (text, query) => {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <strong key={index} style={{ color: 'blue' }}>{part}</strong>
      ) : part
    );
  };

  const handleSeatClick = (seatNumber) => {
    setSelectedSeats((prevSeats) => {
      if (prevSeats.includes(seatNumber)) {
        return prevSeats.filter((seat) => seat !== seatNumber);
      } else if (prevSeats.length < 5) { 
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
            autoComplete="off"
          />
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
          <input
            type="text"
            name="destination"
            placeholder="Enter Destination"
            value={search.destination}
            onChange={handleInputChange}
            autoComplete="off"
          />
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
