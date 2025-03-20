const db = require('../config/db'); 
const bcrypt = require('bcrypt');

const User = {
    async create(username, email, password, full_name, phone_number, role) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = `INSERT INTO users (username, email, password_hash, full_name, phone_number, role) 
                     VALUES (?, ?, ?, ?, ?, ?)`;
        return db.query(sql, [username, email, hashedPassword, full_name, phone_number, role]);  
    },

    async findByUsername(username) {
        const [rows] = await db.query("SELECT user_id FROM users WHERE username = ?", [username]); 
        return rows;
    },

    async findByEmail(email) {
        const [rows] = await db.query("SELECT user_id, email, password_hash, role FROM users WHERE email = ?", [email]); // ✅ FIXED
        return rows;
    },

    async findById(userId) {
        const [userRows] = await db.query(
            "SELECT user_id, username, email, full_name, phone_number, created_at, role FROM users WHERE user_id = ?",
            [userId]
        );
    
        if (userRows.length === 0) return null;
    
        const [bookings] = await db.query(
            "SELECT booking_id, user_id, show_id, booking_date, total_amount, status, payment_status FROM bookings WHERE user_id = ?",
            [userId]
        );
    
        return { user: userRows[0],  bookings: bookings || [] };
    },    
    async update(userId, updates) {
        let query = "UPDATE users SET ";
        let fields = [];
        let values = [];

        for (let key in updates) {
            fields.push(`${key} = ?`);
            values.push(updates[key]);
        }

        query += fields.join(", ") + " WHERE user_id = ?";
        values.push(userId);

        return db.query(query, values);
    }
};

module.exports = User;
