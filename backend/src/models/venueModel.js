const db = require('../config/db'); // Ensure correct import

const Venue = {
    // ✅ Add a new venue

    // Venue model create method
    async create(venue_name, address, city, state, postal_code, contact_number, email, status) {
        const sql = `INSERT INTO venues (venue_name, address, city, state, postal_code, contact_number, email, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return db.query(sql, [venue_name, address, city, state, postal_code, contact_number, email, status]);
    },

    // ✅ Find venue by ID
    async findVenueById(id) {
        const [rows] = await db.query(`SELECT * FROM venues WHERE venue_id = ?`, [id]);
        return rows.length ? rows[0] : null;
    },
    // ✅ Find venue by name
    async findVenueByName(name) {
        const [rows] = await db.query(`SELECT * FROM venues WHERE venue_name = ?`, [name]);
        return rows.length ? rows[0] : null;
    },

    // ✅ Get all venues
    async getAllVenues() {
        const [rows] = await db.query(`SELECT * FROM venues`);
        return rows;
    },
    async getHallsByVenueId(id){
        const [rows] = await db.query(`SELECT * FROM venues WHERE venue_id = ?`,[id]);
        return rows;
    },
    // ✅ Update venue details
    // ✅ Update venue status only
    async updateVenueStatus(venue_id, status) {
        return db.query(`UPDATE venues SET status = ? WHERE venue_id = ?`, [status, venue_id]);
    },
    async deleteHallsByVenueId(venue_id){
        return db.query(`DELETE FROM halls WHERE venue_id = ?`,[venue_id]);
    },
    // ✅ Delete a venue
    async delete(id) {
        return db.query(`DELETE FROM venues WHERE venue_id = ?`, [id]);
    },
    async createHall(venue_id, hall_name, seating_capacity, hall_type, status) {
        const sql = `INSERT INTO halls (venue_id, hall_name, seating_capacity, hall_type, status) 
                     VALUES (?, ?, ?, ?, ?)`;
        return db.query(sql, [venue_id, hall_name, seating_capacity, hall_type, status]);
    },
     // Find hall by ID
    async findHallById(hallId) {
        const [rows] = await db.query("SELECT * FROM halls WHERE hall_id = ?", [hallId]);
        return rows.length > 0 ? rows[0] : null;
    },
    //delete hall by id
    async deleteHall(hallId){
        await db.query("DELETE FROM halls WHERE hall_id = ?", [hallId]);
    },
    //getting all halls
    async getAllHalls(){
        const [rows] = await db.query("SELECT * FROM halls");
        return rows;
    },

    // Get a specific hall by ID
    async getHallById(hallId) {
        const [rows] = await db.query("SELECT * FROM halls WHERE hall_id = ?", [hallId]);
        return rows.length ? rows[0] : null;
    },
      // ✅ Update venue status only
      async updateHallStatus(hall_id, status) {
        return db.query(`UPDATE halls SET status = ? WHERE hall_id = ?`, [status, hall_id]);
    }


};

module.exports = Venue;
