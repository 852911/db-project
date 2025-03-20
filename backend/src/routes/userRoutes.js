const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const authMiddleware = require('../middlewares/authMiddleware');

// ✅ User Registration Route
//tested...............
router.post('/register', async (req, res) => {
    const { username, email, password, full_name, phone_number, role } = req.body;

    if (!username || !email || !password || !full_name) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // Check if the username or email is taken
        const existingUser = await User.findByUsername(username);
        if (existingUser.length > 0) return res.status(400).json({ message: "Username is already taken" });

        const existingEmail = await User.findByEmail(email);
        if (existingEmail.length > 0) return res.status(400).json({ message: "Email is already registered" });

        // Insert the new user
        await User.create(username, email, password, full_name, phone_number, role === "admin" ? "admin" : "user");

        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

// ✅ User Login Route
//tested..........
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const user = await User.findByEmail(email);
        if (user.length === 0) return res.status(401).json({ message: "Invalid email or password" });

        const isMatch = await bcrypt.compare(password, user[0].password_hash);
        if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

        const token = jwt.sign(
            { user_id: user[0].user_id, email: user[0].email, role: user[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});



// ✅ Get User Profile
//tested..........
router.get("/profile", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.user_id;
        const userData = await User.findById(userId); // Ensure correct variable name

        if (!userData) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(userData); // Corrected response variable
    } catch (error) {
        console.error("Error fetching profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// ✅ Update User Profile
// not tested......
router.put("/update-profile", authMiddleware, async (req, res) => {
    try {
        console.log("Received body:", req.body);

        const userId = req.user.user_id;
        const updates = {};

        if (req.body.username) updates.username = req.body.username;
        if (req.body.full_name) updates.full_name = req.body.full_name;
        if (req.body.phone_number) updates.phone_number = req.body.phone_number;
        if (req.body.password) updates.password = await bcrypt.hash(req.body.password, 10);

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        await User.update(userId, updates);

        res.json({ message: "Profile updated successfully" });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
