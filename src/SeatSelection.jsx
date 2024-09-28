import React from 'react';

const SeatSelection = ({ onSeatSelect }) => {
  const seats = [...Array(30).keys()]; // Mocking 30 seats
  
  return (
    <div className="seat-selection">
      <h3>Select Seat</h3>
      <div className="seat-class">
        <h4>Platinum</h4>
        <div className="seat-grid">
          {seats.map((seat, index) => (
            <button
              key={index}
              className="seat"
              onClick={() => onSeatSelect(`P-${seat + 1}`)}
            >
              {seat + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="seat-class">
        <h4>Business</h4>
        <div className="seat-grid">
          {seats.map((seat, index) => (
            <button
              key={index}
              className="seat"
              onClick={() => onSeatSelect(`B-${seat + 1}`)}
            >
              {seat + 1}
            </button>
          ))}
        </div>
      </div>
      <div className="seat-class">
        <h4>Economy</h4>
        <div className="seat-grid">
          {seats.map((seat, index) => (
            <button
              key={index}
              className="seat"
              onClick={() => onSeatSelect(`E-${seat + 1}`)}
            >
              {seat + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
