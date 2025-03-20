const jwt = require("jsonwebtoken");
const db = require("../config/db");

module.exports = async (req, res, next) => {
    try {
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Access denied. No valid token provided." });
        }

        // Extract actual token from "Bearer <token>"
        const token = authHeader.split(" ")[1];

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);

        // Fetch user from database
        const [rows] = await db.query(
            "SELECT user_id, role FROM users WHERE user_id = ?",
            [decoded.user_id]
        );
        
        if (rows.length === 0) {
            return res.status(403).json({ message: "Forbidden: Invalid user" });
        }

        // Attach user details to request
        req.user = {
            user_id: rows[0].user_id,
            role: rows[0].role,
        };

        next(); // Proceed to next middleware or route handler

    } catch (error) {
        console.error("JWT Error:", error.message);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
