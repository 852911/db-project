import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Profile from "./components/UserProfile";
import UpdateProfile from "./components/UpdateProfile";
import { AuthContext, AuthProvider } from "./context/AuthContext"; // Correct import

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if the user is logged in by verifying the token in localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);  // User is logged in if token exists
    }
  }, []);

  const handleLogin = (token) => {
    localStorage.setItem("token", token); // Store token in localStorage
    setIsLoggedIn(true); // Set the logged-in state to true
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false); // Set the logged-in state to false when logged out
  };

  return (
    <AuthProvider>  {/* Wrap the entire app with AuthProvider */}
      <Router>
        <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/profile" element={isLoggedIn ? <Profile /> : <Navigate to="/login" />} />
          <Route path="/update-profile" element={isLoggedIn ? <UpdateProfile /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
