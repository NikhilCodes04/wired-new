const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization; // Standard way to access the header

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header not provided or invalid' });
    }

    const token = authHeader.split(' ')[1]; // Extract token from 'Bearer <token>'
    if (!token) {
        return res.status(401).json({ message: 'No Token, Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach decoded user information to the request object
        next(); // Proceed to the next middleware
    } catch (err) {
        console.error('JWT verification error:', err);
        res.status(403).json({ message: 'Invalid Token, Access Forbidden' });
    }
};

module.exports = verifyToken;
