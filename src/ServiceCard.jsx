import React, { useState } from 'react';
import ServiceCard from './ServiceCard';
import './ServicesSection.css';

const services = [
  { id: 1, title: 'Bid for Business', description: 'Upgrade to a business class with exclusive perks.', imgSrc: '/images/1.jpg' },
  { id: 2, title: 'Advanced Seat Booking', description: 'Choose your preferred seat in advance.', imgSrc: '/images/3.jpg' },
  { id: 3, title: 'Preorder Your Meal', description: 'Select your meal from our menu before your flight.', imgSrc: '/images/travel_insurance.jpg' },
  { id: 4, title: 'Preorder Your Duty-Free', description: 'Order duty-free items and pick them up at the airport.', imgSrc: '/images/travel_insurance.jpg' },
  { id: 5, title: 'Specials On Board', description: 'Check out exclusive offers and deals available on board.', imgSrc: '/images/travel_insurance.jpg' },
  { id: 6, title: 'Travel Insurance', description: 'Add travel insurance to your booking for peace of mind.', imgSrc: '/images/travel_insurance.jpg' },
];

const ServicesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextService = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % services.length);
  };

  const prevService = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + services.length) % services.length);
  };

  const activeService = services[activeIndex];

  return (
    <div className="services-section">
      <button className="carousel-button prev" onClick={prevService}>
        &#10094;
      </button>
      <div className="service-images">
        {services.map((service, index) => (
          <ServiceCard
            key={service.id}
            service={service}
            isActive={index === activeIndex}
          />
        ))}
      </div>
      <button className="carousel-button next" onClick={nextService}>
        &#10095;
      </button>
      <div className="service-description">
        <h2>{activeService.title}</h2>
        <p>{activeService.description}</p>
      </div>
    </div>
  );
};

export default ServicesSection;
