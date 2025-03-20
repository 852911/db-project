const db = require("../config/db");

// Get all movies
const getAllMovies = async () => {
    const [movies] = await db.query("SELECT * FROM movies");
    return movies;
};

// Get a single movie by ID
const getMovieById = async (movieId) => {
    const [movie] = await db.query("SELECT * FROM movies WHERE movie_id = ?", [movieId]);
    return movie.length > 0 ? movie[0] : null;
};

// Add a new movie
const addMovie = async (movieData) => {
    const { 
        title, description, duration, language, genre_id, 
        release_date, end_date, rating, poster_url, trailer_url, status 
    } = movieData;

    await db.query(
        `INSERT INTO movies (title, description, duration, language, genre_id, release_date, 
        end_date, rating, poster_url, trailer_url, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [title, description, duration, language, genre_id, release_date, end_date, 
        rating, poster_url, trailer_url, status]
    );
};

// Delete a movie by ID
const deleteMovie = async (movieId) => {
    await db.query("DELETE FROM movies WHERE movie_id = ?", [movieId]);
};

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    deleteMovie
};
