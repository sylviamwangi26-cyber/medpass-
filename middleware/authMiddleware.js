const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: "Not authorized to access this route" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'medpass_secret_key_2026');
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: "Token expired or invalid" });
    }
};

const restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: "You do not have permission to perform this action" });
        }
        next();
    };
};

module.exports = { protect, restrictTo };
