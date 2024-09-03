const pool = require('./database');

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Error executing query', err.stack);
  } else {
    console.log('Database Time:', res.rows[0]);
  }
  pool.end(); // Close the connection after the query
});
