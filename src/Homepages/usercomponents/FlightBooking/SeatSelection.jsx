import React, { useState, useEffect } from 'react';

const SeatSelection = ({ onSeatSelect }) => {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ticketType, setTicketType] = useState('Economy'); 
  const scheduleId = 6; 

  useEffect(() => {
    const fetchSeats = async () => {
      try {
        const response = await fetch(`http://localhost:3000/booking/getseats?schedule_id=${scheduleId}&ticket_type=${ticketType}`);
        const data = await response.json();
        console.log("Fetched seats:", data); 
        setSeats(data); 
      } catch (error) {
        console.error('Error fetching seats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [ticketType]);

  const handleSeatClick = (seat) => {
    if (!seat.occupied) {
      onSeatSelect(seat);
    }
  };

  if (loading) {
    return <div>Loading seats...</div>;
  }

  console.log("Number of seats to display:", seats.length); 

  return (
    <div>
      <h3>Select Your Seat ({ticketType})</h3>
      <select onChange={(e) => setTicketType(e.target.value)} value={ticketType}>
        <option value="Economy">Economy</option>
        <option value="Business">Business</option>
        <option value="Platinum">Platinum</option>
      </select>

      <div className="seat-selection">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat ${seat.occupied ? 'occupied' : 'available'}`}
            onClick={() => handleSeatClick(seat)}
            style={{
              backgroundColor: seat.occupied ? 'black' : 'white',
              cursor: seat.occupied ? 'not-allowed' : 'pointer',
            }}
          >
            {seat.number}
          </div>
        ))}
      </div>

      <style jsx>{`
        .seat-selection {
          display: grid;
          grid-template-columns: repeat(5, 1fr); /* Adjust based on layout */
          gap: 10px;
        }
        .seat {
          width: 40px; /* Adjust seat size */
          height: 40px; /* Adjust seat size */
          display: flex;
          justify-content: center;
          align-items: center;
          border: 1px solid #000;
        }
        .occupied {
          background-color: black;
        }
        .available {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default SeatSelection;
