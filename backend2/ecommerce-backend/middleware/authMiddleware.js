// // // ecommerce-backend/middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET;

// Define public paths that don't require authentication

const publicPaths = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/products',
  '/categories',
  '/products/:id',
  '/products/:productId/reviews',
  '/reviews/:productId' // Add this line
];

const authenticateToken = (req, res, next) => {
  console.log('=== Auth Middleware ===');
  console.log('Path:', req.path);
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);

  // Skip authentication for public paths and OPTIONS requests
  const isPublicPath = publicPaths.some(path => {
    const regex = new RegExp(`^${path.replace(/:\w+/g, '[^/]+')}$`);
    return regex.test(req.path);
  });

  if (isPublicPath || req.method === 'OPTIONS') {
    console.log('Public path, skipping authentication.');
    return next();
  }

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
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    console.log('User is admin or superadmin. Proceeding...');
    next();
  } else {
    console.log('User is not admin or superadmin. Access denied.');
    return res.status(403).json({
      message: 'Access denied. Admin privileges required.',
      code: 'ADMIN_REQUIRED'
    });
  }
};

const isSuperAdmin = (req, res, next) => {
  console.log('Checking superadmin status...');
  if (req.user && req.user.role === 'superadmin') {
    console.log('User is superadmin. Proceeding...');
    next();
  } else {
    console.log('User is not superadmin. Access denied.');
    return res.status(403).json({
      message: 'Access denied. Superadmin privileges required.',
      code: 'SUPERADMIN_REQUIRED'
    });
  }
};

module.exports = { authenticateToken, isAdmin, isSuperAdmin };
