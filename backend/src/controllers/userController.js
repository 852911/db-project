const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // For generating auth tokens
require('dotenv').config();  // Load environment variables

// 🔹 User Login Function
exports.login = (req, res) => {
    const { email, password } = req.body;

    // ✅ Validate input
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Check if user exists
    const sql = `SELECT * FROM users WHERE email = ?`;
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).json({ message: "Database error", error: err });

        if (results.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];

        // 🔹 Compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // 🔹 Generate JWT Token
        const token = jwt.sign(
            { user_id: user.user_id, email: user.email },
            process.env.JWT_SECRET, // Use environment variable
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    });
};
