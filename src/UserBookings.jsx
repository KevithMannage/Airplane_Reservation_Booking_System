import { useEffect, useState } from "react";

function UserBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Retrieve the token and user_id from localStorage
  const token = localStorage.getItem('token');
  const user_id = localStorage.getItem('user_id');

  useEffect(() => {
    if (token && user_id) {
      fetch(`http://localhost:3000/user/user-bookings/${user_id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(data => {
          setBookings(data);
          setLoading(false);
        })
        .catch(err => {
          setError(err);
          setLoading(false);
        });
    } else {
      setError({ message: "Token or user ID not found in localStorage" });
      setLoading(false);
    }
  }, [token, user_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log(user_id);
  console.log(token);

  return (
    <div>
      {bookings.map((booking, index) => (
        <div key={index} className="booking-card">
          <h3>{booking.flight_name}</h3>
          <p>Departure: {booking.departure_time}</p>
          <p>Arrival: {booking.arrival_time}</p>
          <p>Seat: {booking.seat_number}</p>
          <p>Class: {booking.ticket_class}</p>
        </div>
      ))}
    </div>
  );
}

export default UserBookings;
