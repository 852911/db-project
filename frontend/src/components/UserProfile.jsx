import React, { useState, useEffect } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null); // Store the user data
  const [bookings, setBookings] = useState([]); // Store the bookings data
  const [error, setError] = useState(null); // Store error message if any

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError("You need to log in.");
          return;
        }

        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          }
        });

        // Log the raw response for debugging
        const text = await response.text();
        console.log('Response Text:', text); // Check raw response

        // Check if the response is OK
        if (!response.ok) {
          setError("Failed to fetch profile. Server responded with an error.");
          return;
        }

        // Parse the JSON response
        const data = JSON.parse(text); // Manually parse the text as JSON
        console.log('Parsed Response:', data);

        setUser(data.user);
        setBookings(data.bookings);

      } catch (err) {
        setError("Error fetching profile: " + err.message); // Handle errors
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <div>
        <h3>{user.full_name}</h3>
        <p>Email: {user.email}</p>
        <p>Phone: {user.phone_number}</p>
        <p>Joined on: {new Date(user.created_at).toLocaleDateString()}</p>
      </div>

      <h3>Your Bookings</h3>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.booking_id}>
              <strong>{booking.movie_title}</strong> on {booking.show_date} at {booking.start_time} - {booking.status}
              <p>Venue: {booking.venue_name}, Hall: {booking.hall_name}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserProfile;
