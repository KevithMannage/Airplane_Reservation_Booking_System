import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import the styles
import './CalendarPage.css'; // Ensure to import your CSS file

const CalendarPage = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());

    // Handle date change
    const handleDateChange = (date) => {
        setSelectedDate(date);
        console.log('Selected date:', date); // For demonstration purposes
    };

    return (
        <div className="calendar-page">
            <div className="calendar-container">
                <h1>Flight Booking Calendar</h1>
                <Calendar
                    onChange={handleDateChange}
                    value={selectedDate}
                />
                <p className="selected-date">Selected Date: {selectedDate.toDateString()}</p>

               
            </div>
        </div>
    );
};

export default CalendarPage;
