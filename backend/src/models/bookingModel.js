const db = require("../config/db");

// this code is not fully tested yet...........
const booking = {
    async getAllBookings(){
        const [rows] = await db.query("SELECT * FROM bookings"); 
        return rows;
    },
    async getBookingByID(id){
        const [row] = await db.query("SELECT * FROM bookings WHERE booking_id = ?",[id]); 
        return row;
    },
 async checkSeatAvailability(show_id, seats) {
    try {
        const query = `
            SELECT bs.seat_number 
            FROM booking_seats bs
            JOIN bookings b ON bs.booking_id = b.booking_id
            WHERE b.show_id = ? AND bs.seat_number IN (?);
        `;
        const [results] = await db.query(query, [show_id, seats]);

        return results.length === 0; // True if all seats are available, false if some are booked
    } catch (error) {
        console.error("Error checking seat availability:", error);
        throw error;
    }
},

// ✅ Create a booking
async createBooking(user_id, show_id, seats, total_amount) {
    try {
        const connection = await db.getConnection();
        await connection.beginTransaction();

        // Insert into bookings table
        const insertBookingQuery = `
            INSERT INTO bookings (user_id, show_id, booking_date, total_amount, status, payment_status)
            VALUES (?, ?, NOW(), ?, 'confirmed', 'pending');
        `;
        const [bookingResult] = await connection.query(insertBookingQuery, [user_id, show_id, total_amount]);
        const booking_id = bookingResult.insertId;

        // Insert seats into booking_seats table
        const insertSeatsQuery = `
            INSERT INTO booking_seats (booking_id, seat_number)
            VALUES (?, ?);
        `;
        for (const seat of seats) {
            await connection.query(insertSeatsQuery, [booking_id, seat]);
        }

        await connection.commit();
        connection.release();

        return { booking_id, user_id, show_id, seats, total_amount, status: "confirmed", payment_status: "pending" };
    } catch (error) {
        console.error("Error creating booking:", error);
        throw error;
    }
}
};

module.exports =booking
