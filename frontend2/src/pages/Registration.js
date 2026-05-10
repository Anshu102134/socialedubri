import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [profileImage, setProfileImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setProfileImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const data = new FormData();
            data.append("name", formData.name);
            data.append("email", formData.email);
            data.append("password", formData.password);
            if (profileImage) {
                data.append("profileImage", profileImage);
            }

            const response = await axiosClient.post("/api/users/register", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            alert("Registration successful! Please log in.");
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Registration failed");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            {/* Video background if available */}
            <video autoPlay loop muted className="bg-video">
                <source src="/luxury-bg.mp4" type="video/mp4" />
            </video>

            {/* Form */}
            <form className="form-container glass-card" onSubmit={handleSubmit}>
                <h2>Create Account</h2>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <input
                    className="luxury-input"
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />

                <input
                    className="luxury-input"
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <input
                    className="luxury-input"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                />

                <div style={{ width: '100%', textAlign: 'left', margin: '5px 0' }}>
                    <label style={{ fontSize: '13px', color: 'var(--navy-main)', fontWeight: '500', marginBottom: '5px', display: 'block' }}>Profile Picture (Optional)</label>
                    <input
                        className="luxury-input"
                        type="file"
                        name="profileImage"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={{ padding: '8px 10px', background: 'white' }}
                    />
                </div>

                <button
                    className="luxury-button"
                    type="submit"
                    disabled={isSubmitting}
                    style={{ marginTop: '10px' }}
                >
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
                
                <div className="form-divider" style={{marginTop: '15px'}}>
                    <span>OR</span>
                </div>

                <p style={{ fontSize: "13px", margin: 0 }}>
                    Already have an account? 
                    <span
                        style={{ color: "var(--gold-accent)", cursor: "pointer", marginLeft: "5px", fontWeight: "600" }}
                        onClick={() => navigate('/login')}
                    >
                        Log In
                    </span>
                </p>
            </form>

            {/* Footer */}
            <footer className="footer">
                © 2026 LuxeConnect
            </footer>
        </div>
    );
}

export default RegisterForm;