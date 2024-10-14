import React, { useState } from 'react';
import axios from 'axios';
import './Report.css'

const Report = () => {
  const [reportType, setReportType] = useState('');
  const [destinationCode, setDestinationCode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      const response = await axios.post('http://localhost:3000/report', {
        reportType,
        destinationCode,
        startDate,
        endDate,
        origin,
        destination
      });
      setReportData(response.data.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch report');
    }
  };

  const handleGenerateReport = () => {
    fetchReport();
  };

  return (
    <div>
      <h2>Report Generator</h2>

      <div>
        <label>Report Type: </label>
        <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
          <option value="">Select Report Type</option>
          <option value="passengers_above_18_years">Passengers Above 18 Years</option>
          <option value="passengers_by_destination">Passengers By Destination</option>
          <option value="bookings_by_type">Bookings By Type</option>
          <option value="flights_by_route">Flights By Route</option>
          <option value="revenue_by_aircraft">Revenue By Aircraft</option>
        </select>
      </div>

      {(reportType === 'passengers_by_destination' || reportType === 'flights_by_route') && (
        <>
          <div>
            <label>Origin: </label>
            <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
          </div>
          <div>
            <label>Destination: </label>
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} />
          </div>
        </>
      )}

      {(reportType === 'passengers_by_destination' || reportType === 'bookings_by_type') && (
        <>
          <div>
            <label>Start Date: </label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div>
            <label>End Date: </label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </>
      )}

      <div>
        <button onClick={handleGenerateReport}>Generate Report</button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {reportData && (
        <div>
          <h3>Report Results</h3>
          <table border="1">
            <thead>
              <tr>
                {Object.keys(reportData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reportData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <td key={idx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Report;
