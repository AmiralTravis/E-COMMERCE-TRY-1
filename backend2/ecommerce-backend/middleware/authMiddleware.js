// const jwt = require('jsonwebtoken');

// const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Ensure this matches the key used in auth routes

// // Middleware function to check if the user is authenticated
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401); // Unauthorized if no token

//   jwt.verify(token, SECRET_KEY, (err, user) => {
//     if (err) return res.sendStatus(403); // Forbidden if token is invalid
//     req.user = user; // Attach user info to request object
//     next(); // Proceed to the next middleware or route handler
//   });
// };

// module.exports = authenticateToken;


const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key'; // Ensure this matches the key used in auth routes

// Middleware function to check if the user is authenticated
const authenticateToken = (req, res, next) => {
  console.log('Authenticating token...');
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    console.log('No token found');
    return res.sendStatus(401); // Unauthorized if no token
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err.message);
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    console.log('Token verified successfully');
    req.user = user; // Attach user info to request object
    next(); // Proceed to the next middleware or route handler
  });
};

module.exports = authenticateToken;