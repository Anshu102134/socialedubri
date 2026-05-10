import React, { useContext, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_URL } from '../config';

const ProfilePage = () => {
    const { user, setUser, loading } = useContext(AuthContext);
    const [bio, setBio] = useState(user?.bio || "");
    const [name, setName] = useState(user?.name || "");
    const [profileImage, setProfileImage] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [message, setMessage] = useState("");

    // Sync state when user loads
    React.useEffect(() => {
        if (user) {
            setBio(user.bio || "");
            setName(user.name || "");
        }
    }, [user]);

    if (loading) return <p style={{textAlign:'center', marginTop:'50px'}}>Loading profile...</p>;
    if (!user) return <Navigate to="/login" replace />;

    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);
        setMessage("");
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("bio", bio);
            if (profileImage) {
                formData.append("profileImage", profileImage);
            }

            const res = await axiosClient.put("/api/users/update-profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setUser({ ...user, ...res.data.user });
            setMessage("Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setMessage(err.response?.data?.message || "Failed to update profile");
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto 10px auto' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--navy-light)', overflow: 'hidden', border: '4px solid var(--gold-accent)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        {user.profileImage ? (
                            <img src={`${API_URL}${user.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        ) : (
                            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'60px'}}>
                                {user.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                        )}
                    </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                    <input
                        type="file"
                        id="profile-pic-upload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => setProfileImage(e.target.files[0])}
                    />
                    <label htmlFor="profile-pic-upload" style={{ cursor: 'pointer', color: 'var(--gold-accent)', fontSize: '14px', fontWeight: '500' }}>
                        {profileImage ? `Selected: ${profileImage.name}` : 'Change Profile Picture'}
                    </label>
                </div>

                <h2 style={{ marginBottom: '10px', fontSize: '32px' }}>{user.name}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>{user.email}</p>
                <p style={{ color: 'var(--gold-accent)', fontWeight: '600', marginBottom: '30px', fontSize: '14px' }}>
                    {user.friends?.length || 0} Buds
                </p>

                <form onSubmit={handleUpdate} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--navy-main)' }}>Display Name</label>
                        <input
                            type="text"
                            className="luxury-input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                        />
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: 'var(--navy-main)' }}>Bio</label>
                        <textarea
                            className="luxury-input"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            style={{ minHeight: '120px', resize: 'vertical' }}
                        />
                    </div>

                    {message && (
                        <div style={{ 
                            padding: '12px', 
                            borderRadius: '8px', 
                            marginBottom: '20px', 
                            backgroundColor: message.includes('success') ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                            color: message.includes('success') ? '#2e7d32' : '#d32f2f',
                            fontSize: '14px',
                            textAlign: 'center',
                            border: `1px solid ${message.includes('success') ? '#2e7d3233' : '#d32f2f33'}`
                        }}>
                            {message}
                        </div>
                    )}

                    <button type="submit" className="luxury-button" style={{ width: '100%' }} disabled={isUpdating}>
                        {isUpdating ? 'Updating...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
