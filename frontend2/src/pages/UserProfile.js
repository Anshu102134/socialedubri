import React, { useContext, useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axiosClient from '../api/axiosClient';
import { API_URL } from '../config';

const UserProfile = () => {
    const { id } = useParams();
    const { user: currentUser, loading: authLoading } = useContext(AuthContext);
    const [targetUser, setTargetUser] = useState(null);
    const [status, setStatus] = useState('none'); // 'none', 'sent', 'received', 'friends'
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axiosClient.get(`/api/users/profile/${id}`);
                setTargetUser(res.data.user);
                setStatus(res.data.status);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchUserProfile();
    }, [id]);

    const handleSendRequest = async () => {
        setActionLoading(true);
        try {
            await axiosClient.post('/api/friendRequest/send', { to: id });
            setStatus('sent');
        } catch (err) {
            alert(err.response?.data?.message || "Error sending request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleAcceptRequest = async () => {
        setActionLoading(true);
        try {
            await axiosClient.post('/api/friendRequest/accept', { from_id: id });
            setStatus('friends');
        } catch (err) {
            alert(err.response?.data?.message || "Error accepting request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectRequest = async () => {
        setActionLoading(true);
        try {
            await axiosClient.post('/api/friendRequest/cancel', { from_id: id });
            setStatus('none');
        } catch (err) {
            alert(err.response?.data?.message || "Error rejecting request");
        } finally {
            setActionLoading(false);
        }
    };

    const handleUnfriend = async () => {
        if (!window.confirm("Are you sure you want to unfriend this bud?")) return;
        setActionLoading(true);
        try {
            await axiosClient.post("/api/users/unfriend", { targetId: id });
            setStatus('none');
            setTargetUser(prev => ({
                ...prev,
                friends: prev.friends.filter(fid => fid !== currentUser._id)
            }));
        } catch (err) {
            console.error("Error unfriending:", err);
            alert("Failed to unfriend");
        } finally {
            setActionLoading(false);
        }
    };

    if (authLoading || loading) return <p style={{textAlign:'center', marginTop:'50px', color: 'white'}}>Loading profile...</p>;
    if (!currentUser) return <Navigate to="/login" replace />;
    if (id === currentUser._id) return <Navigate to="/profile" replace />;
    if (!targetUser) return <p style={{textAlign:'center', marginTop:'50px', color: 'white'}}>User not found.</p>;

    return (
        <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                <div style={{ width: '150px', height: '150px', margin: '0 auto 30px auto', borderRadius: '50%', backgroundColor: 'var(--navy-light)', overflow: 'hidden', border: '4px solid var(--gold-accent)', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                    {targetUser.profileImage ? (
                        <img src={`${API_URL}${targetUser.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                    ) : (
                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'60px'}}>
                            {targetUser.name ? targetUser.name[0].toUpperCase() : 'U'}
                        </div>
                    )}
                </div>

                <h2 style={{ marginBottom: '10px', fontSize: '32px', color: 'white' }}>{targetUser.name}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '5px' }}>{targetUser.email}</p>
                <p style={{ color: 'var(--gold-accent)', fontWeight: '600', marginBottom: '20px', fontSize: '14px' }}>
                    {targetUser.friends?.length || 0} Buds
                </p>
                
                {targetUser.bio && (
                    <div style={{ marginBottom: '30px', fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                        "{targetUser.bio}"
                    </div>
                )}
 
                 <div style={{ marginTop: '30px' }}>
                     {status === 'friends' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
                            <span style={{ color: 'var(--gold-accent)', fontWeight: 'bold', fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                🤝 Buds
                            </span>
                            <button 
                                onClick={handleUnfriend}
                                disabled={actionLoading}
                                style={{ 
                                    background: 'transparent', 
                                    border: '1px solid rgba(255,77,77,0.5)', 
                                    color: 'rgba(255,77,77,0.8)', 
                                    padding: '5px 12px', 
                                    borderRadius: '4px', 
                                    cursor: 'pointer',
                                    fontSize: '11px',
                                    textTransform: 'uppercase'
                                }}
                            >
                                {actionLoading ? '...' : 'Unfriend'}
                            </button>
                        </div>
                     )}

                    {status === 'sent' && (
                        <button className="luxury-button" style={{ opacity: 0.7, cursor: 'default' }} disabled>
                            Request Sent
                        </button>
                    )}

                    {status === 'received' && (
                        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                            <button className="luxury-button" onClick={handleAcceptRequest} disabled={actionLoading}>
                                {actionLoading ? '...' : 'Accept Request'}
                            </button>
                            <button 
                                className="luxury-button" 
                                style={{ background: 'transparent', border: '1px solid #ff4d4d', color: '#ff4d4d' }} 
                                onClick={handleRejectRequest} 
                                disabled={actionLoading}
                            >
                                {actionLoading ? '...' : 'Reject'}
                            </button>
                        </div>
                    )}

                    {status === 'none' && (
                        <button className="luxury-button" onClick={handleSendRequest} disabled={actionLoading}>
                            {actionLoading ? 'Sending...' : 'Add Friend'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
