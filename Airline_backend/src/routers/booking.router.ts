import { Router } from "express";
import connection from "../db";

const router = Router();

router.get('/getSeats', async (req, res) => {
  // Extract the query parameters from the URL
  const { schedule_id, ticket_type } = req.query;

  const query = `CALL GetAvailableSeats(?, ?)`;

  try {
    const [rows] = await connection.execute(query, [schedule_id, ticket_type]);

    // Check if rows[0] exists and is an array
    if (Array.isArray(rows)) {
      // Check if the first element is also an array (result set)
      if (Array.isArray(rows[0])) {
        const seatNumbers = rows[0].map(row => row.seat_number);
        res.status(200).json(seatNumbers);
      } else {
        res.status(500).json({ message: 'Unexpected result format from database.' });
      }
    } else {
      res.status(500).json({ message: 'Unexpected result format from database.' });
    }
  } catch (error) {
    console.error('Error getting available seats:', error);
    res.status(500).json({ message: 'Failed to get available seats', error });
  }
});


// API: Add a reservation using the AddReservation stored procedure
router.post('/addReservation', async (req, res) => {
  const { schedule_id, ticket_type, seat_no } = req.body;

  const query = `CALL AddReservation(?, ?, ?)`;

  try {
    // Execute the stored procedure
    const [result] = await connection.execute(query, [schedule_id, ticket_type, seat_no]);

    // Check the result for any errors or specific conditions (if needed)
    res.status(201).json({ message: 'Reservation added successfully', result });
  } catch (error) {
    // Check if the error is related to the seat not being available
    if ((error as any).sqlState === '45000') {
      res.status(400).json({ message: 'Seat not available or already reserved' });
    } else {
      console.error('Error adding reservation:', error);
      res.status(500).json({ message: 'Failed to add reservation', error });
    }
  }
});



 // API: Add a booking using the AddBooking stored procedure
 router.post('/addBooking', async (req, res) => {
  const {
    schedule_id,
    user_id,
    date,
    ticket_type,
    seat_no,
    first_name,
    last_name,
    dob,
    gender,
    passport_number,
    address,       // New parameter
    state,         // New parameter
    country        // New parameter
  } = req.body;

  // Ensure no undefined values are passed, use null instead
  const params = [
    schedule_id ?? null,
    user_id ?? null,
    date ?? null,
    ticket_type ?? null,
    seat_no ?? null,
    first_name ?? null,
    last_name ?? null,
    dob ?? null,
    gender ?? null,
    passport_number ?? null,
    address ?? null,   
    state ?? null,     
    country ?? null    
  ];

  const query = `CALL AddBooking(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    // Execute the stored procedure
    const [result] = await connection.execute(query, params);

    // Check the result for any errors or specific conditions (if needed)
    res.status(201).json({ message: 'Booking added successfully', result });
  } catch (error) {
    // Check if the error is related to the seat not being reserved
    if ((error as any).sqlState === '45000') {
      res.status(400).json({ message: 'Seat number is not reserved or does not exist.' });
    } else {
      console.error('Error adding booking:', error);
      res.status(500).json({ message: 'Failed to add booking', error });
    }
  }
});

  
export default router;