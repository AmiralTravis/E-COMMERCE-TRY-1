// // ecommerce-backend/middleware/authMiddleware.js

// const jwt = require('jsonwebtoken');

// const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
// const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

// const authenticateToken = (req, res, next) => {
//   console.log('Authenticating token...');
//   const accessToken = req.cookies.accessToken;
//   const refreshToken = req.cookies.refreshToken;

//   // Check if both tokens are missing
//   if (!accessToken && !refreshToken) {
//     console.log('No tokens provided. Authentication required.');
//     return res.status(401).json({ 
//       message: 'Authentication required',
//       code: 'AUTH_REQUIRED'
//     });
//   }

//   try {
//     if (accessToken) {
//       // Verify access token
//       const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
//       req.user = decoded; // Attach user info to req object
//       console.log('Access token verified. User:', decoded);
//       return next();
//     }

//     // If only refresh token is present, verify it
//     const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
//     console.log('Refresh token verified. Decoded:', decoded);
    
//     // Generate a new access token
//     const newAccessToken = jwt.sign(
//       { id: decoded.id, username: decoded.username },
//       ACCESS_TOKEN_SECRET,
//       { expiresIn: '1h' }
//     );

//     // Set the new access token in the cookies
//     res.cookie('accessToken', newAccessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       sameSite: 'lax',
//       maxAge: 60 * 60 * 1000 // 1 hour
//     });

//     req.user = decoded; // Attach user info to req object
//     console.log('New access token generated and set in cookies.');
//     next();
//   } catch (error) {
//     console.error('Auth middleware error:', error);
    
//     // Clear cookies if authentication fails
//     res.clearCookie('accessToken');
//     res.clearCookie('refreshToken');
    
//     return res.status(401).json({ 
//       message: 'Authentication expired',
//       code: error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'AUTH_EXPIRED'
//     });
//   }
// };

// module.exports = authenticateToken;

// ecommerce-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

const authenticateToken = (req, res, next) => {
  console.log('Authenticating token...');
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  console.log('Access token:', accessToken ? 'Present' : 'Missing');
  console.log('Refresh token:', refreshToken ? 'Present' : 'Missing');

  if (!accessToken && !refreshToken) {
    console.log('No tokens provided. Authentication required.');
    return res.status(401).json({ 
      message: 'Authentication required',
      code: 'AUTH_REQUIRED'
    });
  }

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, ACCESS_TOKEN_SECRET);
      req.user = decoded;
      console.log('Access token verified. User:', decoded);
      return next();
    }

    const decoded = jwt.verify(refreshToken, REFRESH_TOKEN_SECRET);
    console.log('Refresh token verified. Decoded:', decoded);
    
    const newAccessToken = jwt.sign(
      { id: decoded.id, username: decoded.username },
      ACCESS_TOKEN_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 1000 // 1 hour
    });

    req.user = decoded;
    console.log('New access token generated and set in cookies.');
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    
    return res.status(401).json({ 
      message: 'Authentication expired',
      code: error.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'AUTH_EXPIRED'
    });
  }
};

module.exports = authenticateToken;