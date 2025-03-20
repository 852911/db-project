const db = require('../config/db'); // Ensure correct import

const Venue = {
    async create(venue_name, address, city, state, postal_code, contact_number, email, status) {
        const sql = `INSERT INTO venues (venue_name, address, city, state, postal_code, contact_number, email, status) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        return db.query(sql, [venue_name, address, city, state, postal_code, contact_number, email, status]);
    },

    async findVenueById(id) {
        const [rows] = await db.query(`SELECT * FROM venues WHERE venue_id = ?`, [id]);
        return rows.length ? rows[0] : null;
    },
    async findVenueByName(name) {
        const [rows] = await db.query(`SELECT * FROM venues WHERE venue_name = ?`, [name]);
        return rows.length ? rows[0] : null;
    },

    async getAllVenues() {
        const [rows] = await db.query(`SELECT * FROM venues`);
        return rows;
    },
    async getHallsByVenueId(id){
        const [rows] = await db.query(`SELECT * FROM venues WHERE venue_id = ?`,[id]);
        return rows;
    },
    async updateVenueStatus(venue_id, status) {
        return db.query(`UPDATE venues SET status = ? WHERE venue_id = ?`, [status, venue_id]);
    },
    async deleteHallsByVenueId(venue_id){
        return db.query(`DELETE FROM halls WHERE venue_id = ?`,[venue_id]);
    },
    async delete(id) {
        return db.query(`DELETE FROM venues WHERE venue_id = ?`, [id]);
    },
    async createHall(venue_id, hall_name, seating_capacity, hall_type, status) {
        const sql = `INSERT INTO halls (venue_id, hall_name, seating_capacity, hall_type, status) 
                     VALUES (?, ?, ?, ?, ?)`;
        return db.query(sql, [venue_id, hall_name, seating_capacity, hall_type, status]);
    },
    async findHallById(hallId) {
        const [rows] = await db.query("SELECT * FROM halls WHERE hall_id = ?", [hallId]);
        return rows.length > 0 ? rows[0] : null;
    },
    async deleteHall(hallId){
        await db.query("DELETE FROM halls WHERE hall_id = ?", [hallId]);
    },
    async getAllHalls(){
        const [rows] = await db.query("SELECT * FROM halls");
        return rows;
    },
    async getHallById(hallId) {
        const [rows] = await db.query("SELECT * FROM halls WHERE hall_id = ?", [hallId]);
        return rows.length ? rows[0] : null;
    },
      async updateHallStatus(hall_id, status) {
        return db.query(`UPDATE halls SET status = ? WHERE hall_id = ?`, [status, hall_id]);
    }


};

module.exports = Venue;
