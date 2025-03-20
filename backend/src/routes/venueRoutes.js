const express = require('express');
const router = express.Router();
const Venue = require('../models/venueModel');
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");



// Get all venues (Public route)
//tested...........
router.get("/allvenues", async (req, res) => {
    try {
        const venues = await Venue.getAllVenues();
        res.status(200).json(venues);
    } catch (error) {
        console.error("Error fetching venues:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//tested........
router.get("/:venue_id/halls", async (req, res) => {
    try {
        const { venue_id } = req.params;
        const venueId = parseInt(venue_id, 10);

        if (isNaN(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        // Check if the venue exists
        const venue = await Venue.findVenueById(venueId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        // Fetch all halls associated with this venue
        const halls = await Venue.getHallsByVenueId(venueId);
        res.status(200).json(halls);
    } catch (error) {
        console.error("Error fetching halls for venue:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// ✅ Add a new venue
//tested.........
router.post('/addvenue', authMiddleware, adminMiddleware, async (req, res) => {
    const { venue_name, address, city, state, postal_code, contact_number, email, status } = req.body;

    // Validate required fields
    if (!venue_name || !address || !city || !state || !contact_number || !email) {
        return res.status(400).json({ message: "All fields are required" });
    }

    // Set default values if not provided
    const venueStatus = status || 'active'; // Default status to 'active'
    const venuePostalCode = postal_code || null; // Set postal_code to null if not provided
    try {
        // Pass the adjusted values to create function
         // Check for duplicate venue name
         const isDuplicate = await Venue.findVenueByName(venue_name);
         if (isDuplicate) {
             return res.status(400).json({ message: "A venue with this name already exists" });
         }
        await Venue.create(venue_name, address, city, state, venuePostalCode, contact_number, email, venueStatus);
        res.status(201).json({ message: "Venue added successfully!" });
    } catch (error) {
        console.error("Error adding venue:", error);
        res.status(500).json({ message: "Server error" });
    }
});


// Admin: Delete a venue and all associated halls
//tested........
router.delete("/deletevenue/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const venueId = parseInt(id, 10);

        if (isNaN(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        const venue = await Venue.findVenueById(venueId);  // Use Venue.findVenueById instead of getVenueById
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        // First, delete associated halls
        //await Venue.deleteHallsByVenueId(venueId);

        // Then, delete the venue
        await Venue.delete(venueId);

        res.status(200).json({ message: "Venue and associated halls deleted successfully" });
    } catch (error) {
        console.error("Error deleting venue:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Get venue by ID (Public route)
//tested........
router.get('/getvenue/:id',async (req, res) =>{
    try {
        const { id } = req.params;
        const venueId = parseInt(id, 10);

        if (isNaN(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        const venue = await Venue.findVenueById(venueId); // Fetch the venue details by ID
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        res.status(200).json(venue); // Return the venue details as a response
    } catch (error) {
        console.error("Error fetching venue details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
// Update venue status (Admin only)
//tested........
router.put('/updatevenue/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const venueId = parseInt(id, 10);
        let { status } = req.body;

        if (isNaN(venueId)) {
            return res.status(400).json({ message: "Invalid venue ID" });
        }

        // Ensure status is lowercase
        status = status.toLowerCase();

        // Validate status value
        if (status !== 'active' && status !== 'inactive') {
            return res.status(400).json({ message: "Status must be either 'active' or 'inactive'" });
        }

        // Check if the venue exists
        const venue = await Venue.findVenueById(venueId);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        // Log before updating
        console.log("Updating venue ID:", venueId, "with status:", status);

        // Update only the status field
        await Venue.updateVenueStatus(venueId, status); // Pass only the string

        res.status(200).json({ message: `Venue status updated to ${status} successfully` });
    } catch (error) {
        console.error("Error updating venue status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



//-----------------------hall routes-------------------
//get all halls..........
// GET /halls → Retrieve all halls
//tested.......
router.get("/gethalls", authMiddleware, async (req, res) => {
    try {
        const halls = await Venue.getAllHalls();
        res.status(200).json(halls);
    } catch (error) {
        console.error("Error fetching halls:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// GET /halls/:id → Retrieve details of a specific hall
//tested....
router.get("/gethalls/:id", authMiddleware, async function (req, res) {
    try {
        const hallId = parseInt(req.params.id, 10);

        if (isNaN(hallId)) {
            return res.status(400).json({ message: "Invalid hall ID" });
        }

        const hall = await Venue.getHallById(hallId);

        if (!hall) {
            return res.status(404).json({ message: "Hall not found" });
        }

        res.status(200).json(hall);
    } catch (error) {
        console.error("Error fetching hall details:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


// Add a new hall to a venue (admin action)...
//tested....
router.post('/addhall', authMiddleware, adminMiddleware, async (req, res) => {
    const {venue_id, hall_name, seating_capacity, hall_type, status } = req.body;

    // Validate required fields
    if (!venue_id || !hall_name || !seating_capacity) {
        return res.status(400).json({ message: "Venue ID, hall name, and seating capacity are required" });
    }

    // Validate that the venue exists
    try {
        const venue = await Venue.findVenueById(venue_id);
        if (!venue) {
            return res.status(404).json({ message: "Venue not found" });
        }

        // Set default values if not provided
        const hallStatus = status || 'active';  // Default to 'active' if not provided
        const hallType = hall_type || '2D';  // Default to '2D' if not provided

        // Insert the new hall into the database
        await Venue.createHall(venue_id, hall_name, seating_capacity, hallType, hallStatus);

        res.status(201).json({ message: "Hall added successfully!" });
    } catch (error) {
        console.error("Error adding hall:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// deleting a hall by its id (admin action only)
//tested.........
router.delete("/deletehall/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const hallId = parseInt(id, 10);

        if (isNaN(hallId)) {
            return res.status(400).json({ message: "Invalid hall ID" });
        }

        // Check if the hall exists
        const hall = await Venue.findHallById(hallId);
        if (!hall) {
            return res.status(404).json({ message: "Hall not found" });
        }

        // Delete the hall
        await Venue.deleteHall(hallId);

        res.status(200).json({ message: "Hall deleted successfully" });
    } catch (error) {
        console.error("Error deleting hall:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//updatehall/:id → Update hall details admin action only..
//tested..
router.put('/updatehall/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const hallId = parseInt(id, 10);
        let { status } = req.body;

        if (isNaN(hallId)) {
            return res.status(400).json({ message: "Invalid hall ID" });
        }

        // Validate status value
        if (status !== 'active' && status !== 'inactive' && status !== 'maintenance') {
            return res.status(400).json({ message: "Status must be either 'active' or 'inactive' or 'maintenance'" });
        }

        // Check if the venue exists
        const hall = await Venue.findHallById(hallId);
        if (!hall) {
            return res.status(404).json({ message: "hall not found" });
        }

        // Log before updating
        //console.log("Updating  ID:", venueId, "with status:", status);

        // Update only the status field
        await Venue.updateHallStatus(hallId, status); // Pass only the string

        res.status(200).json({ message: `hall status updated to ${status} successfully` });
    } catch (error) {
        console.error("Error updating venue status:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});






module.exports = router;
