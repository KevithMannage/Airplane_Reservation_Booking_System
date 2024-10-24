
import React, { useState } from 'react';
import './WhyWeAreBest.css'; 

const WhyWeAreBest = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? -1 : index);
  };

  return (
    <div className="why-best-section">
      <h2>Why We Are The Best In The Game</h2>
      <hr className="title-underline" />

      <div className="content-container">
        <div className="accordion">
          {["Fast And Easy Service", "Why Online Booking", "24 Hours Customer Support", "Recent Awards"].map((title, index) => (
            <div className="accordion-item" key={index}>
              <button
                className={`accordion-title ${activeIndex === index ? 'active' : ''}`}
                onClick={() => toggleAccordion(index)}
              >
                {title}
                <span className="accordion-icon">{activeIndex === index ? '-' : '+'}</span>
              </button>
              {activeIndex === index && (
                <div className="accordion-content">
                  {index === 0 && "We have made the booking process simple and fast. Search for a flight, pick the seats as you wish, complete the payment. It’s that easy!"}
                  {index === 1 && "Online booking offers flexibility, convenience, and quick access to deals and discounts."}
                  {index === 2 && "Our support team is available 24/7 to assist you with any inquiries or issues."}
                  {index === 3 && "We have been recognized for excellence in customer service, innovation, and safety."}
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="airline-logo">
          <img src="/6.jpg" alt="Airline Logo" /> 
          <p>Subsidiary of Virgin Airlines</p>
        </div>
      </div>
    </div>
  );
};

export default WhyWeAreBest;
