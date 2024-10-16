// // ecommerce-backend/middleware/authMiddleware.js

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
      { id: decoded.id, username: decoded.username, role: decoded.role },
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

const isAdmin = (req, res, next) => {
  console.log('Checking admin status...');
  if (req.user && req.user.role === 'admin') {
    console.log('User is admin. Proceeding...');
    next();
  } else {
    console.log('User is not admin. Access denied.');
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.',
      code: 'ADMIN_REQUIRED'
    });
  }
};

module.exports = { authenticateToken, isAdmin };