create database bookingApp
use BookingApp
-- Users table to store user information
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
select * from users
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';
-- Venues table to store theater/cinema locations
CREATE TABLE venues (
    venue_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(50) NOT NULL,
    state VARCHAR(50) NOT NULL,
    postal_code VARCHAR(10),
    contact_number VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL,
    status ENUM('active', 'inactive') DEFAULT 'active'
);


-- Halls/Screens within venues
CREATE TABLE halls (
    hall_id INT PRIMARY KEY AUTO_INCREMENT,
    venue_id INT NOT NULL,
    hall_name VARCHAR(50) NOT NULL,
    seating_capacity INT NOT NULL,
    hall_type ENUM('2D', '3D', 'IMAX', '4DX') DEFAULT '2D',
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    FOREIGN KEY (venue_id) REFERENCES venues(venue_id)
);
-- ondelete cascade constraint has been added on the fk in halls table by alter cmd...

SET FOREIGN_KEY_CHECKS = 1;
-- Movies table
CREATE TABLE movies (
    movie_id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    duration INT NOT NULL, -- in minutes
    language VARCHAR(50) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    release_date DATE NOT NULL,
    end_date DATE NOT NULL,
    rating VARCHAR(10) NOT NULL,
    poster_url VARCHAR(255) NOT NULL,
    trailer_url VARCHAR(255) NOT NULL,
    status ENUM('upcoming', 'now_showing', 'ended') NOT NULL DEFAULT 'upcoming'
);

-- Show times/schedules
CREATE TABLE shows (
    show_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    hall_id INT NOT NULL,
    show_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    base_price DECIMAL(10,2) NOT NULL,
    status ENUM('available', 'almost_full', 'full', 'cancelled') DEFAULT 'available',
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id)
);

-- Seat layout for each hall
CREATE TABLE seats (
    seat_id INT PRIMARY KEY AUTO_INCREMENT,
    hall_id INT NOT NULL,
    seat_row CHAR(2) NOT NULL,
    seat_number INT NOT NULL,
    seat_type ENUM('regular', 'premium', 'recliner') DEFAULT 'regular',
    status ENUM('active', 'maintenance', 'inactive') DEFAULT 'active',
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id),
    UNIQUE KEY unique_seat (hall_id, seat_row, seat_number)
);

-- Bookings table
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    show_id INT NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (show_id) REFERENCES shows(show_id)
);

-- Booked seats for each booking
CREATE TABLE booked_seats (
    booked_seat_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    seat_id INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    FOREIGN KEY (seat_id) REFERENCES seats(seat_id)
);

-- Payments table
CREATE TABLE payments (
    payment_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    transaction_id VARCHAR(100),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    FOREIGN KEY (booking_id) REFERENCES bookings(booking_id)
);

-- Movie Reviews table
CREATE TABLE movie_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    movie_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review_text TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'hidden') DEFAULT 'active',
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE KEY unique_movie_review (movie_id, user_id)
);

-- Hall Reviews table
CREATE TABLE hall_reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    hall_id INT NOT NULL,
    user_id INT NOT NULL,
    rating DECIMAL(2,1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
    comfort_rating INT CHECK (comfort_rating >= 1 AND comfort_rating <= 5),
    sound_rating INT CHECK (sound_rating >= 1 AND sound_rating <= 5),
    visual_rating INT CHECK (visual_rating >= 1 AND visual_rating <= 5),
    review_text TEXT,
    image_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status ENUM('active', 'hidden') DEFAULT 'active',
    FOREIGN KEY (hall_id) REFERENCES halls(hall_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    UNIQUE KEY unique_hall_review (hall_id, user_id)
);
CREATE TABLE genres (
    genre_id INT PRIMARY KEY AUTO_INCREMENT,
    genre_name VARCHAR(100) NOT NULL UNIQUE
);

select * from movies
select * from users
select * from booked_seats
select * from bookings
select * from hall_reviews
select * from payments
select * from seats
select * from halls
select * from shows
select * from venues
select * from genres
ALTER TABLE movies DROP COLUMN genre;
ALTER TABLE movies ADD COLUMN genre_id INT NOT NULL;
ALTER TABLE movies 
ADD CONSTRAINT fk_movies_genre 
FOREIGN KEY (genre_id) REFERENCES genres(genre_id);

INSERT INTO genres (genre_name) VALUES 
('Action'),
('Drama');


DELETE FROM users ;
INSERT INTO halls (venue_id, hall_name, seating_capacity, hall_type, status)
VALUES 
    (1, 'Hall A', 200, '2D', 'active'),
    (1, 'Hall B', 150, 'IMAX', 'active');

SET SQL_SAFE_UPDATES = 1
select * from halls;

ALTER TABLE halls
ADD CONSTRAINT fk_venue_id FOREIGN KEY (venue_id) REFERENCES venues(venue_id) ON DELETE CASCADE;


alter table halls
drop foreign key halls_ibfk_1


