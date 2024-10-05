import React from 'react';

const PassengerInfo = ({ scheduleId }) => {
  return (
    <div className="passenger-info-container">
      <div className="passenger-info">
        <h3>Passenger Information</h3>
        <p>Booking for Schedule ID: {scheduleId}</p> {/* Display the schedule ID */}
        <form>
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
          <input type="text" placeholder="Date of Birth" required />
          <input type="text" placeholder="Gender" required />
          <input type="text" placeholder="Passport Number" required />
          <button type="submit" className="btn-create-booking">
                Create Booking
              </button>
        
        </form>
      </div>
    </div>
  );
};

export default PassengerInfo;
