import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext"; // Import AuthContext


function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check login status from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token from localStorage:", token); // Log token to verify it's correctly fetched
    setIsLoggedIn(!!token); // Set the login state based on token presence

    // Listen for authChange event to force update
    const handleAuthChange = () => {
        const updatedToken = localStorage.getItem("token");
        setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("authChange", handleAuthChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
        window.removeEventListener("authChange", handleAuthChange);
    };
}, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token from localStorage
    setIsLoggedIn(false); // Update state to logged out
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">Navbar</Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          {/* Centered Navigation Links */}
          <ul className="navbar-nav mx-auto d-flex justify-content-center gap-4">
            <li className="nav-item">
              <Link className="nav-link active" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/movies">Movies</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/offers">Offers</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/contact">Contact</Link>
            </li>
          </ul>

          {/* Conditional Rendering for Auth */}
          <div className="d-flex ms-auto gap-2">
            {isLoggedIn ? (
              // Profile Button with Dropdown Menu when Logged In
              <div className="dropdown">
                <button 
                  className="btn btn-outline-success dropdown-toggle" 
                  type="button" 
                  id="profileDropdown" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  👤 Profile
                </button>
                <ul className="dropdown-menu" aria-labelledby="profileDropdown">
                  <li>
                    <Link className="dropdown-item" to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link className="dropdown-item" to="/update-profile">Edit Profile</Link>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                  </li>
                </ul>
              </div>
            ) : (
              // Login and Signup Buttons when Logged Out
              <>
                <Link to="/login" className="btn btn-outline-primary">Login</Link>
                <Link to="/signup" className="btn btn-primary">Signup</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
