import React from 'react';
import './TermsAndConditions.css'; 
const TermsAndConditions = () => {
  return (
    <div className='terms'>
      <div className="terms-container">
        <h1>Terms and Conditions</h1>
        
        <section>
          <h2>Definitions</h2>
          <ul>
            <li><strong>IWS Aviation</strong>: Refers to IWS Aviation (Private) Limited.</li>
            <li><strong>Baggage</strong>: Passenger's personal property for transportation, including Checked and Unchecked Baggage.</li>
            <li><strong>Checked Baggage</strong>: Baggage delivered to IWS Aviation with a Baggage Identification Tag.</li>
            <li><strong>Carriage</strong>: Transportation of Passengers and Baggage as per the Ticket.</li>
            <li><strong>Convention</strong>: Refers to the Warsaw Convention, amended by The Hague and incorporated into Sri Lankan law.</li>
            <li><strong>Damage</strong>: Includes harm to Passengers or Baggage during transportation.</li>
            <li><strong>Force Majeure</strong>: Includes unforeseen events affecting Carriage, such as natural disasters or government actions.</li>
            <li><strong>Passenger</strong>: Any person traveling on IWS Aviation.</li>
            <li><strong>Tariff</strong>: Published fares and charges by IWS Aviation.</li>
            <li><strong>Ticket</strong>: Document detailing Carriage specifications.</li>
            <li><strong>Website</strong>: IWS Aviation's internet site, www.iwsaviation.com.</li>
          </ul>
        </section>

        <section>
          <h2>Applicability</h2>
          <p>These Conditions apply to air carriage of Passengers and Baggage and any liability of IWS Aviation. They prevail over other regulations unless otherwise specified.</p>
        </section>

        <section>
          <h2>Fares, Taxes, Fees, and Charges</h2>
          <p>Fares cover travel from the point of origin to Destination but exclude ground transport. Full payment is required at booking. Taxes and charges will be advised at the time of Ticket purchase.</p>
        </section>

        <section>
          <h2>Check-in, Boarding, and Conduct</h2>
          <p>Check-in is 30 minutes before departure. IWS Aviation can refuse carriage under certain conditions, including non-payment or disruptive behavior. Passengers must comply with security and health checks, and follow all crew instructions.</p>
        </section>

        <section>
          <h2>Refusal and Limitation of Carriage</h2>
          <p>Special needs passengers should confirm acceptance before booking. Expectant mothers and infants have specific requirements. IWS Aviation is not responsible for health issues related to altitude or pregnancy.</p>
        </section>

        <section>
          <h2>Baggage</h2>
          <p>Weight limits apply to different aircraft. Excess baggage may incur charges. IWS Aviation is not liable for valuable items in checked baggage or prohibited items. Fragile baggage is carried at the passenger's risk.</p>
        </section>

        <section>
          <h2>Schedules, Delays, and Cancellations</h2>
          <p>IWS Aviation may change timetables and is not liable for delays or cancellations beyond its control. We aim to provide timely transportation.</p>
        </section>

        <section>
          <h2>Limitation of Liability</h2>
          <p>Liability is governed by the Convention or applicable law. For delays or damage, limits apply, and IWS Aviation is not liable for indirect or consequential damages.</p>
        </section>

        <section>
          <h2>General</h2>
          <p>IWS Aviation may change flight schedules and will attempt to notify passengers. Additional services are subject to third-party terms. Animals are not carried. The contract is governed by Sri Lankan law. Passengers must follow instructions and conditions of the Ticket.</p>
        </section>
      </div>
    </div>
  );
};

export default TermsAndConditions;
