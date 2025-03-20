import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        full_name: "",
        phone_number: ""
    });

    const [error, setError] = useState(""); // Handle errors
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (event) => {
        event.preventDefault(); // Prevent page reload
    
        try {
            const response = await fetch("http://localhost:5000/api/users/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                console.log("Signup successful:", data);
    
                // 🔥 Auto-login after signup
                localStorage.setItem("token", data.token); // Assuming API returns token
                window.dispatchEvent(new Event("authChange")); // Trigger event to update Navbar
                navigate("/home"); // Redirect to home
            } else {
                setError(data.message || "Signup failed. Try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Something went wrong. Please try again.");
        }
    };
    

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-4">Signup</h2>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSignup}>
                            <div className="d-flex m-2 gap-3">
                                <div className="mb-3 flex-grow-1">
                                    <label className="form-label">Username</label>
                                    <input type="text" className="form-control" name="username" value={formData.username} onChange={handleChange} required />
                                </div>
                                <div className="mb-3 flex-grow-1">
                                    <label className="form-label">Full Name</label>
                                    <input type="text" className="form-control" name="full_name" value={formData.full_name} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <input type="password" className="form-control" name="password" value={formData.password} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone Number (Optional)</label>
                                <input type="text" className="form-control" name="phone_number" value={formData.phone_number} onChange={handleChange} />
                            </div>
                            <button type="submit" className="btn btn-success w-100">Signup</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
