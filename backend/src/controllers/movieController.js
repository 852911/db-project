const db = require("../config/db");

exports.getMovies = async (req, res) => {
    try {
        // Using db.promise() to ensure Promise-based execution
        const [movies] = await db.promise().query("SELECT * FROM movies WHERE status = 'now_showing'");

        res.status(200).json(movies);
    } catch (err) {
        console.error("Error fetching movies:", err.message);
        res.status(500).json({ message: "Error fetching movies", error: err.message });
    }
};
