const express = require("express"); // Add this line at the top
const router = express.Router();
const Show = require("../models/showModel");
const db = require("../config/db");

//const express = require('express');
//const router = express.Router();
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const adminMiddleware = require("../middlewares/adminMiddleware");



// Get all shows (Public route)
//tested.......
router.get("/getshows", async (req, res) => {
    try {
        const shows = await Show.getAllShows();
        res.status(200).json(shows);
    } catch (error) {
        console.error("Error fetching shows:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Add a new show admin only...
//tested........
router.post('/addshow', authMiddleware, adminMiddleware, async (req, res) => {
    const { movie_id, hall_id, show_date, start_time, end_time, base_price, status } = req.body;

    // 1. Validate input fields
    if (!movie_id || !hall_id || !show_date || !start_time || !end_time || !base_price || !status) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        // 2. Check if the hall exists and get its venue status
       /* const [hallData] = await db.query(`
            SELECT h.status AS hall_status, v.status AS venue_status
            FROM halls h
            JOIN venues v ON h.venue_id = v.venue_id
            WHERE h.hall_id = ?
        `, [hall_id]);*/
        const hallData = await Show.findHall(hall_id);
       // res.status(200).json("Hall not found here");
      // console.log("🔍 Hall Data:", hallData);

        if (!hallData || hallData.length === 0) {
            return res.status(404).json({ message: "Hall not found here now" });
        }

        // 3. Check the status of the venue (active/inactive)
        if (hallData.status !== 'active') {
            return res.status(400).json({ message: "Venue is inactive, cannot add a show." });
        }

        // 4. Check the status of the hall (active/inactive)
        const venue_status = await Show.venueStatus(hallData.hall_id);
        //const venueStatus = await Show.venueStatus(hall_id);
        console.log("Venue Status for Hall ID", hall_id, ":", venue_status);

        if (venue_status !== 'active') {
            return res.status(400).json({ message: "Venue is inactive, cannot add a show." });
        }

        // 5. Ensure no overlapping shows in the same hall on the same date
        const [overlappingShow] = await db.query(`
            SELECT 1 FROM shows 
            WHERE hall_id = ? 
            AND show_date = ? 
            AND (
                (start_time <= ? AND end_time > ?)  -- New show starts inside an existing one
                OR (start_time < ? AND end_time >= ?) -- New show ends inside an existing one
                OR (start_time >= ? AND end_time <= ?) -- New show is completely inside an existing one
            )
        `, [hall_id, show_date, end_time, start_time, end_time, start_time, start_time, end_time]);
        
        console.log("Checking show conflict:", overlappingShow);

        if (overlappingShow.length > 0) {
            return res.status(400).json({ message: "Show timing conflicts with an existing show in this hall." });
        }

        // 6. Insert the new show into the database
        await db.query(`
            INSERT INTO shows (movie_id, hall_id, show_date, start_time, end_time, base_price, status)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [movie_id, hall_id, show_date, start_time, end_time, base_price, status]);

        res.status(201).json({ message: "Show added successfully!" });

    } catch (error) {
        console.error("Error adding show:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// update a show admin action only.........
//tested............
router.put('/updateshow/:id', authMiddleware, adminMiddleware, async (req, res) => {
    const { id } = req.params; 
    const { status } = req.body;

    // Ensure all required fields are provided
    if (!status) {
        return res.status(400).json({ message: "Status to be updated required" });
    }

    try {
        // Check if the show exists
        const existingShow = await Show.getShowById(id);
        if (!existingShow || existingShow.length ===0) {
            return res.status(404).json({ message: "Show not found" });
        }

        // Update the show details
        await Show.updateShow(id, status);

        res.status(200).json({ message: "Show updated successfully!" });
    } catch (error) {
        console.error("Error updating show:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//get shows by id...
//tested...........
router.get('/getshow/:id', async (req, res) => {
    try {
        const { id } = req.params;
        
        // Fetch show details
        const existingShow = await Show.getShowById(id);
        
        // If show not found, return 404
        if (!existingShow || existingShow.length === 0) {
            return res.status(404).json({ message: "Show not found" });
        }

        return res.status(200).json(existingShow);
    } catch (error) {
        console.error("Error fetching show:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.delete('/deleteshow/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the show exists
        const existingShow = await Show.getShowById(id);
        if (!existingShow || existingShow.length === 0) {
            return res.status(404).json({ message: "Show not found" });
        }

        // Delete the show
        await Show.deleteShow(id);

        return res.status(200).json({ message: "Show deleted successfully!" });
    } catch (error) {
        console.error("Error deleting show:", error);
        return res.status(500).json({ message: "Server error", error: error.message });
    }
});

module.exports = router;
