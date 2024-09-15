const jwt = require('jsonwebtoken');
const logger = require('../utils/logger')

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //logger.info("in authToken decoded info",decoded);
        req.user = decoded;
        next();
    } catch (error) {
        logger.error("in authToken error",error);
        res.status(400).json({ isVerified:false,message: 'Invalid token.' });
    }
};

module.exports = verifyToken;
