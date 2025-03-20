const express = require("express");
const router = express.Router();
const db = require("../config/db");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
const Booking = require('../models/bookingModel');


// ✅ View all bookings (Admin only)
//tested...


router.get("/getbookings", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const bookings = await Booking.getAllBookings();
        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ message: "No bookings found" });
        }
        res.status(200).json(bookings);
    } catch (error) {
        console.error("Error fetching bookings:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


//GET /bookings/:id → View details of a specific booking
//to be tested not complete..
router.get('/getbooking/:id',authMiddleware, adminMiddleware, async (req, res)=>{
    try {
        const {id} = req.params;
        const booking = await Booking.getBookingByID(id);
        if (!booking || booking.length === 0) {
            return res.status(404).json({ message: "No booking found with this id" });
        }
        res.status(200).json(booking);
    } catch (error) {
        console.error("Error fetching booking:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    } 
});

//creating a route that the user would be able to book setas for a movie/show
// ✅ Create a new booking (User only)
router.post('/createbooking', authMiddleware, async (req, res) => {
    try {
        console.log("User Info:", req.user); // Debugging

        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User ID missing" });
        }

        const user_id = req.user.id; // Ensure user_id is retrieved correctly
        const { show_id, seats } = req.body;

        if (!show_id || !seats || seats.length === 0) {
            return res.status(400).json({ message: "Show ID and seats are required" });
        }

        // Check if seats are available
        const availableSeats = await Booking.checkSeatAvailability(show_id, seats);
        if (!availableSeats) {
            return res.status(400).json({ message: "Some seats are already booked" });
        }

        // Calculate the total amount based on seat types
        const totalAmount = await Booking.calculateTotalAmount(seats);

        // Create a booking
        const booking = await Booking.createBooking(user_id, show_id, seats, totalAmount);
        res.status(201).json({ message: "Booking successful", booking });

    } catch (error) {
        console.error("Error creating booking:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
