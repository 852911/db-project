const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized. Please log in." });
    }
    
    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Access denied. Admins only." });
    }

    next(); // Proceed to the next middleware or route handler
};

module.exports = adminMiddleware;
