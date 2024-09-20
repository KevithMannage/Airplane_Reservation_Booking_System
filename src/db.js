const mysql = require('mysql2');

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'kevith',
    database: 'database_project'
});

// Export the pool for use in other parts of the application
const promisePool = pool.promise();

module.exports = promisePool;
