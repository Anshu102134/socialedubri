import React, { useState, useContext } from 'react';
import axiosClient from '../api/axiosClient';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

export const LoginPage = () => {
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const loginHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        
        try {
            const response = await axiosClient.post('/api/users/login', { email, password });
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser({ ...user, token });

            navigate('/feed');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || '❌ Login failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="register-page">
            <video autoPlay loop muted className="bg-video">
                <source src="/luxury-bg.mp4" type="video/mp4" />
            </video>

            <div className="form-container glass-card">
                <h2>Welcome Back</h2>
                <div className="luxury-accent">✦</div>

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <form onSubmit={loginHandler} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <input
                        className="luxury-input"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        className="luxury-input"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button className="luxury-button" type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Authenticating...' : 'Log In'}
                    </button>
                </form>

                <div className="form-divider" style={{marginTop: '20px'}}>
                    <span>OR</span>
                </div>

                <p style={{ fontSize: "13px" }}>
                    Don't have an account?
                    <span
                        style={{ color: "var(--gold-accent)", cursor: "pointer", marginLeft: "5px", fontWeight: "600" }}
                        onClick={() => navigate('/register')}
                    >
                        Sign Up
                    </span>
                </p>
            </div>
            
            <footer className="footer">
                © 2026 LuxeConnect
            </footer>
        </div>
    );
};
