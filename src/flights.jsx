import React from 'react';
import './flights.css'; // Link to the CSS file

const Flights = () => {
  const aircrafts = [
    {
      name: 'Boeing 737 MAX 10',
      imgSrc: 'boeing.jpeg', // Replace with the actual image path
      passengerCapacity: 186,
      fuelCapacity: '25941.00 L',
      maxLoad: '88300.00 Kg',
      avgSpeed: '838 Kmph',
      manufacturer: 'Boeing Commercial'
    },
    {
      name: 'Boeing 757 300',
      imgSrc: 'boeing2.jpeg',
      passengerCapacity: 242,
      fuelCapacity: '43400.00 L',
      maxLoad: '123980.00 Kg',
      avgSpeed: '918 Kmph',
      manufacturer: 'Boeing Commercial'
    },
    {
      name: 'Airbus A380 800',
      imgSrc: 'aibus.jpg',
      passengerCapacity: 568,
      fuelCapacity: '323546.00 L',
      maxLoad: '575000.00 Kg',
      avgSpeed: '903 Kmph',
      manufacturer: 'Airbus'
    }
  ];

  return (
    
    <div className="flights-page">
      <header className="header">
        <h1>Aircraft Details</h1>
        <p>Home - Aircraft Models</p>
      </header>
      <div className="aircraft-container">
        {aircrafts.map((aircraft, index) => (
          <div key={index} className="aircraft-card">
            <img src={aircraft.imgSrc} alt={aircraft.name} />
            <h3>{aircraft.name}</h3>
            <ul>
              <li><i className="icon"></i>Max Passenger Capacity: {aircraft.passengerCapacity}</li>
              <li><i className="icon"></i>Fuel Capacity: {aircraft.fuelCapacity}</li>
              <li><i className="icon"></i>Max Load: {aircraft.maxLoad}</li>
              <li><i className="icon"></i>Avg Air Speed: {aircraft.avgSpeed}</li>
              <li><i className="icon"></i>Manufacturer: {aircraft.manufacturer}</li>
            </ul>
          </div>
        ))}

    </div>
</div>
   
  );
 
};

export default Flights;
