import React, { useState } from 'react';
import './FlightsSearch.css'; 

const FlightsSearch = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    console.log(`Searching for flights from ${from} to ${to} on ${date}`);
  };

  return (
    <div className="flights-search-container">
      <h2>Search for Flights</h2>
      <div className="search-field">
        <label htmlFor="from">From:</label>
        <input
          id="from"
          type="text"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        />
      </div>
      <div className="search-field">
        <label htmlFor="to">To:</label>
        <input
          id="to"
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>
      <div className="search-field">
        <label htmlFor="date">Date:</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <button className="search-button" onClick={handleSearch}>
        Search Flights
      </button>
    </div>
  );
};

export default FlightsSearch;
