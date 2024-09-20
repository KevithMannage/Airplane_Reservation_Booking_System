import { Router } from "express";
import connection from "../db";

const router = Router();

// Example API: Get all users
router.get("/", async (req, res) => {
  try {
    const [rows] = await connection.query("SELECT * FROM user");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve users");
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows]: [any[], any] = await connection.query(
      "SELECT email, first_name, last_name, dob, gender, passport_number, address, state, country  FROM user WHERE user_id = ?",
      [id]
    );

    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve user");
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .send("Missing required parameters: email and password");
  }

  try {
    const [rows]: [any[], any] = await connection.query(
      "SELECT user_id, email, first_name, last_name, gender, dob, passport_number, address, state, country, passport_number FROM user WHERE email = ? AND password = ?",
      [email, password]
    );

    if (rows.length) {
      res.json(rows[0]);
    } else {
      res.status(401).send("Invalid email or password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to log in");
  }
});

router.post("/register", async (req, res) => {
  const {
    email,
    password,
    first_name,
    last_name,
    dob,
    passport_number,
    tier,
    gender,
    address,
    state,
    country
  } = req.body;

  // Flight count is explicitly set to 0
  const flight_count = 0;

  const query = `
      INSERT INTO User (email, password, first_name, last_name, dob, passport_number, flight_count, tier, gender, address, state, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const values = [
    email,
    password,
    first_name,
    last_name,
    dob,
    passport_number,
    flight_count,
    tier,
    gender,
    address,
    state,
    country
  ];

  try {
    const [result] = await connection.execute(query, values);
    res.status(201).json({ message: "User added successfully", result });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Failed to add user", error });
  }
});


router.get("/user-bookings/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await connection.query(
      "select source_airport_code, destination_airport_code, flight_no, date_time, ticket_type, price from booking join schedule on booking.schedule_id = schedule.schedule_id where booking.user_id = ?;",
      [user_id]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to retrieve user bookings");
  }
});

export default router;
