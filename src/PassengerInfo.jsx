import React from 'react';

const PassengerInfo = () => {
  return (
    <div className="passenger-info-container">
      <div className="passenger-info">
        <h3>Passenger Information</h3>
        <form>
          <input type="text" placeholder="Full Name" required />
          <input type="text" placeholder="Passport Number" required />
          <input type="date" placeholder="Date of Birth" required />
          <select>
            <option>Seat Number</option>
            <option value="1A">1A</option>
            <option value="1B">1B</option>
          </select>
        </form>
      </div>
    </div>
  );
};

export default PassengerInfo;
