const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const publicRoutes = [
        '/api/users/register',
        '/api/users/login'
    ];

    console.log('📦 authMiddleware imported');
    console.log('🔍 Request URL:', req.originalUrl);

    // Skip auth check for public routes
    const isPublic = publicRoutes.some(route =>
        req.originalUrl.startsWith(route)
    );

    if (isPublic) {
        return next();
    }

    try {
        const token = req.headers['authorization']?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Authorization token missing' });
        }

        // ✅ Use JWT secret from environment variable
        const secretKey = process.env.JWT_SECRET || 'supersecret123';
        const decoded = jwt.verify(token, secretKey);

        req.user = { id: decoded.id };
        next();
    } catch (err) {
        console.log('❌ Auth failed:', err.message);
        return res.status(401).json({ message: 'Authorization failed from middleware' });
    }
};

module.exports = authMiddleware;