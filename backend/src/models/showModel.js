const db = require("../config/db");

const Show = {


    // ✅ Get all shows
    async getAllShows() {
        const [rows] = await db.query(`SELECT * FROM shows`);
        return rows;
    },
    //check if hall exists/////
    async findHall(hall_id){
        const [rows] = await db.query("SELECT * FROM halls WHERE hall_id = ?", [hall_id]);
        return rows.length ? rows[0] : null;
    },
    async venueStatus(hall_id) {
        try {
            const [rows] = await db.query(`
                SELECT v.status 
                FROM venues v
                WHERE v.venue_id = (SELECT h.venue_id FROM halls h WHERE h.hall_id = ?)
            `, [hall_id]);
    
            // If hall doesn't exist, treat it as "inactive"
            return rows.length ? rows[0].status : "inactive";
    
        } catch (error) {
            console.error("❌ Error fetching venue status:", error);
            return "inactive"; // Treat errors as "inactive" to prevent crashes
        }
    },    
    // ✅ Check the status of the venue and hall before placing a show
    async getStatus(hall_id) {
        try {
            // ✅ First, check if the hall exists
            const [hallExists] = await db.query(`SELECT venue_id, status FROM halls WHERE hall_id = ?`, [hall_id]);
    
            console.log("Hall Query Result:", hallExists); // Debugging log
    
            if (!hallExists.length) {
                return { status: "inactive", message: "Invalid hall ID: No such hall exists." };
            }
    
            const venue_id = hallExists[0].venue_id; 
            const hallStatus = hallExists[0].status;
    
            // ✅ Check if the venue is active
            const [venueStatusResult] = await db.query(`
                SELECT status 
                FROM venues 
                WHERE venue_id = ?
            `, [venue_id]);
    
            console.log("Venue Status Query Result:", venueStatusResult); // Debugging log
    
            if (!venueStatusResult.length) {
                return { status: "inactive", message: "Venue not found for the given hall." };
            }
    
            const venueStatus = venueStatusResult[0].status;
            if (venueStatus === "inactive") {
                return { status: "inactive", message: "The chosen venue is currently inactive" };
            }
    
            // ✅ Check if the hall is inactive
            if (hallStatus === "inactive" || hallStatus === "maintenance") {
                return { status: "inactive", message: "The selected hall is currently inactive or under maintenance" };
            }
    
            return { status: "active", message: "The venue and hall are available for booking" };
    
        } catch (error) {
            console.error("Error checking venue and hall status:", error);
            return { status: "inactive", message: "Server error while checking status" };
        }
    }
    
    ,    
      // ✅ Create a new show
      async createShow(movie_id, hall_id, show_date, start_time, end_time, base_price, status) {
        try {
            // Check if hall exists
            const [hallCheck] = await db.query(`SELECT * FROM halls WHERE hall_id = ?`, [hall_id]);
            if (hallCheck.length === 0) {
                return { success: false, message: "Invalid hall_id: No such hall exists." };
            }
    
            // Proceed with inserting show if hall exists
            const [result] = await db.query(`
                INSERT INTO shows (movie_id, hall_id, show_date, start_time, end_time, base_price, status) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `, [movie_id, hall_id, show_date, start_time, end_time, base_price, status]);
    
            return { success: true, message: "Show added successfully!", showId: result.insertId };
        } catch (error) {
            console.error("Error adding show:", error);
            return { success: false, message: "Error adding show", error: error.message };
        }
    }
    ,

    async getShowById(id){
        const [rows] = await db.query(`SELECT * FROM shows WHERE show_id = ?`, [id]);
        return rows;
    },
    async updateShow(id, status){
        return db.query(`UPDATE shows SET status = ? WHERE show_id = ?`, [status, id]);
    },
    async deleteShow(id){
        return db.query(`DELETE FROM shows WHERE show_id = ?`, [id]);
    }
};



module.exports = Show;



/*
//check if venue is active......
    select status
    from venues
    where venue_id = (select venue_id from halls where hall_id = id)

    if(status == inactive){
       return venue is inactive
    }
       //check if the hall is inactive.....
       else if (status == active){
        select status from halls where hall_id = id
        if(status == 'inactive' || status =='maintenance'){
        return hall is currently inactive
        }
       }
        //else place the show in the shows table 
        //rest handle all the conditions like the hall id is available in the halls table or not

 */