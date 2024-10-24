import React from 'react';

const PassengerInfo = ({ scheduleId }) => {
  return (
    <div className="passenger-info-container">
      <div className="passenger-info">
        <h3>Passenger Information</h3>
        <p>Booking for Schedule ID: {scheduleId}</p> 
        <form>
          <input type="text" placeholder="First Name" required />
          <input type="text" placeholder="Last Name" required />
          <input type="text" placeholder="Date of Birth" required />
          <input type="text" placeholder="Gender" required />
          <input type="text" placeholder="Passport Number" required />
            </form>
      </div>
    </div>
  );
};

export default PassengerInfo;
