import React, { useState } from 'react';
import './BookAndSearchFlight.css';
 
const BookAndSearchFlight = () => {
  const [search, setSearch] = useState({
    destination: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearch({ ...search, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Searching for:', search);
    // Add actual search functionality here
  };

  return (
    <div className="app">
    

      {/* Search Form */}
      <section className="search-form">
        <h2>Find Your Next Stay</h2>
        <form onSubmit={handleSearch}>
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
            type="date"
            name="checkOut"
            placeholder="Check-out Date"
            value={search.checkOut}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="guests"
            placeholder="Guests"
            value={search.guests}
            min="1"
            onChange={handleInputChange}
          />
          <button type="submit" className="btn">Search</button>
        </form>
      </section>

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
        </div>
      </section>
    </div>
  );
};

export default BookAndSearchFlight;
