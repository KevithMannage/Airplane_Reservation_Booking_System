import { Router } from "express";
import connection from "../db";

const router = Router();

router.get("/full", async (req, res) => {
  try {
    const [rows] = await connection.query("CALL GetFutureSchedule()");
    //console.log(rows);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve schedules");
  }
});

// API: Get future schedule by route using a stored procedure
router.get("/flight/future", async (req, res) => {
  const { from, to } = req.query;
  //console.log(from, to);

  if (!from || !to) {
    return res
      .status(400)
      .send("Missing required query parameters: from and to");
  }

  try {
    // Type the result to let TypeScript know what to expect
    const [rows]: [any[], any] = await connection.query(
      "CALL GetFutureScheduleByRoute(?, ?)",
      [from, to]
    );

    if (rows.length > 0) {
      res.json(rows);
    } else {
      res.status(404).send("No flights found for the given route");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("An error occurred while retrieving the schedule");
  }
});

// API: Get future schedule by route and date range using a stored procedure
router.get('/flight/daterange', async (req, res) => {
    // Trim the query parameters to remove any extraneous whitespace or newlines
    const start = (req.query.start as string).trim();
    const end = (req.query.end as string).trim();
    const from = (req.query.from as string).trim();
    const to = (req.query.to as string).trim();
  
    if (!start || !end || !from || !to) {
      return res.status(400).send('Missing required query parameters: start, end, from, and to');
    }
  
    try {
      //console.log(`Params: start=${start}, end=${end}, from=${from}, to=${to}`);
      
      // Build the query with trimmed parameters
      const query = `CALL GetFutureScheduleByRouteAndDateRange('${start}', '${end}', '${from}', '${to}')`;
      console.log('Executing SQL query:', query);
  
      const [rows]: [any[], any] = await connection.query(query);
  
      //console.log('Raw rows:', JSON.stringify(rows, null, 2));
  
      if (rows.length > 0 && rows[0].length > 0) {
        res.json(rows);
      } else {
        res.status(404).send('No flights found for the given route and date range');
      }
    } catch (err) {
      console.error('Error occurred during procedure execution:', err);
      res.status(500).send('An error occurred while retrieving the schedule');
    }
  });

  router.get('/flight/:id', async (req, res) => {
    const { id } = req.params;
    
    try {
        const [rows]:[any[], any] = await connection.query('SELECT * FROM schedule WHERE schedule_id = ?', [id]);
    
        if (rows.length) {
        res.json(rows[0]);
        } else {
        res.status(404).send('Schedule not found');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Failed to retrieve schedule');
    }
  });


// API to get the total seat count from the schedule
// import { RowDataPacket } from 'mysql2';

// router.get('/flight/seats/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [rows]: [RowDataPacket[], any] = await connection.query(
//       'SELECT economy_seats, business_seats, plantinum FROM schedule WHERE schedule_id = ?',
//       [id]
//     );

//     if (rows.length > 0) {
//       // Assuming seat numbers are stored in one or more of the selected columns
//       const seatNumbers = rows.map((row: RowDataPacket) => {
//         // Adjust this depending on how your seat numbers are stored
//         return row.economy_seats || row.business_seats || row.platinum;
//       });
//       res.status(200).json(seatNumbers);
//     } else {
//       res.status(404).json({ message: 'No seats found for the provided schedule_id.' });
//     }
//   } catch (error) {
//     console.error('Error getting available seats:', error);
//     res.status(500).json({ message: 'Failed to get available seats', error });
//   }
// });

  
export default router;
