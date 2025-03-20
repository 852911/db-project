const express = require("express");
const router = express.Router();
const { getAllMovies, getMovieById, addMovie, deleteMovie } = require("../models/movieModel");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

//tested......
router.get("/getmovies", async (req, res) => {
    try {
        const movies = await getAllMovies();
        res.status(200).json(movies);
    } catch (error) {
        console.error("Error fetching movies:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
//tested..............
router.post("/addmovie", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { title, description, duration, language, genre_id, release_date, end_date, rating, poster_url, trailer_url, status } = req.body;

        if (!title || !description || !duration || !language || !genre_id || !release_date || !end_date || !rating || !poster_url || !trailer_url || !status) {
            return res.status(400).json({ message: "All fields are required" });
        }

        await addMovie(req.body);
        res.status(201).json({ message: "Movie added successfully" });
    } catch (error) {
        console.error("Error adding movie:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

// Delete a movie by ID
router.delete("/deletemovie/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const movieId = parseInt(id, 10);

        if (isNaN(movieId)) {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        const movie = await getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        await deleteMovie(movieId);
        res.status(200).json({ message: "Movie deleted successfully" });
    } catch (error) {
        console.error("Error deleting movie:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});



//tested...
router.get("/getmovie/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const movieId = parseInt(id, 10);

        if (isNaN(movieId)) {
            return res.status(400).json({ message: "Invalid movie ID" });
        }

        const movie = await getMovieById(movieId);
        if (!movie) {
            return res.status(404).json({ message: "Movie not found" });
        }

        res.status(200).json(movie);
    } catch (error) {
        console.error("Error fetching movie:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});


module.exports = router;
