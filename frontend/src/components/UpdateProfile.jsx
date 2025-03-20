import { useState, useContext } from "react";
import API from "../api";
import { AuthContext } from '../context/AuthContext'; // Correct named import

const UpdateProfile = () => {
    const { user, login } = useContext(AuthContext);
    const [email, setEmail] = useState(user?.email || "");

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const { data } = await API.put("/update-profile", { email });
            login(data.user);
        } catch (error) {
            console.error("Update failed:", error.response?.data || error.message);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="card p-4 shadow">
                        <h2 className="text-center mb-3">Update Profile</h2>
                        <form onSubmit={handleUpdate}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <button type="submit" className="btn btn-primary w-100">Update</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;
