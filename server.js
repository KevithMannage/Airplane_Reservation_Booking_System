import http from 'http';
import mysql from 'mysql2';
import url from 'url';
import querystring from 'querystring';
import bcrypt from 'bcrypt';

// Create a MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'kevith',
    database: 'database_project'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

const server = http.createServer((req, res) => {
    const { method, url: requestUrl } = req;

    // Parse URL and query parameters
    const parsedUrl = url.parse(requestUrl, true);
    const { pathname, query } = parsedUrl;

    if (method === 'POST' && pathname === '/signup') {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', async () => {
            const { user_id, email, password, first_name, last_name, gender, dob, passport_number } = querystring.parse(body);
            
            // Check if user already exists
            db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Database error' }));
                    return;
                }
                
                if (results.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User already exists' }));
                    return;
                }

                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 10);

                // Insert new user
                db.query(
                    'INSERT INTO users (user_id, email, password, first_name, last_name, gender, dob, passport_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                    [user_id, email, hashedPassword, first_name, last_name, gender, dob, passport_number],
                    (err, results) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Database error' }));
                            return;
                        }
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'User created successfully' }));
                    }
                );
            });
        });

    } else if (method === 'POST' && pathname === '/login') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString(); // Convert Buffer to string
        });

        req.on('end', () => {
            const { email, password } = querystring.parse(body);

            // Check if user exists
            db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Database error' }));
                    return;
                }

                if (results.length === 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'User not found' }));
                    return;
                }

                const user = results[0];

                // Check password
                const match = await bcrypt.compare(password, user.password);

                if (!match) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Invalid credentials' }));
                    return;
                }

                // Optionally, generate a token here if needed

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Login successful' }));
            });
        });

    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not Found' }));
    }
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
