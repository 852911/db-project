const db = require("../config/db");


const getAllMovies = async () => {
    const [movies] = await db.query("SELECT * FROM movies");
    return movies;
};
const getMovieById = async (movieId) => {
    const [movie] = await db.query("SELECT * FROM movies WHERE movie_id = ?", [movieId]);
    return movie.length > 0 ? movie[0] : null;
};

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

const deleteMovie = async (movieId) => {
    await db.query("DELETE FROM movies WHERE movie_id = ?", [movieId]);
};

module.exports = {
    getAllMovies,
    getMovieById,
    addMovie,
    deleteMovie
};
