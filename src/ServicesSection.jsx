import React, { useState, useEffect } from 'react';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

const services = [
  { id: 1, title: 'Bid for Business', description: 'Upgrade to a business class with exclusive perks.', imgSrc: '/1.jpg' },
  { id: 2, title: 'Advanced Seat Booking', description: 'Choose your preferred seat in advance.', imgSrc: '/2.jpg' },
  { id: 3, title: 'Preorder Your Meal', description: 'Select your meal from our menu before your flight.', imgSrc: '/3.jpg' },
  { id: 4, title: 'Preorder Your Duty-Free', description: 'Order duty-free items and pick them up at the airport.', imgSrc: '/4.jpg' },
  { id: 5, title: 'Specials On Board', description: 'Check out exclusive offers and deals available on board.', imgSrc: '/5.jpg' },
  { id: 6, title: 'Travel Insurance', description: 'Add travel insurance to your booking for peace of mind.', imgSrc: '/images/travel_insurance.jpg' },
];

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % services.length);
    }, 3000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <div className="services-section">
      {services.map((service, index) => (
        <ServiceCard
          key={service.id}
          service={service}
          isActive={index === activeIndex}
        />
      ))}
    </div>
  );
};

export default ServicesSection;
