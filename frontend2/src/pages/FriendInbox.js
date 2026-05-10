import React, { useEffect, useState, useContext } from "react";
import axiosClient from "../api/axiosClient";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const FriendInbox = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const res = await axiosClient.get("/api/friendRequest/inbox");
                setRequests(res.data);
            } catch (err) {
                console.error("Error fetching requests:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchRequests();
    }, [user]);

    const handleAction = async (type, from_id) => {
        setProcessing(from_id);
        try {
            const endpoint = type === "accept" 
                ? "/api/friendRequest/accept" 
                : "/api/friendRequest/cancel";
            
            await axiosClient.post(endpoint, { from_id });
            
            // Remove from list
            setRequests((prev) => prev.filter((r) => r.from?._id !== from_id));
        } catch (err) {
            console.error(`Error ${type} request:`, err);
            alert(err.response?.data?.message || "Something went wrong");
        } finally {
            setProcessing(null);
        }
    };

    if (authLoading || loading) return <p style={{textAlign:'center', marginTop:'50px', color:'white'}}>Loading requests...</p>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div style={{ padding: '60px 20px', maxWidth: '600px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '30px', color: 'white', fontSize: '32px' }}>
                Friend Requests
            </h2>

            {requests.length === 0 ? (
                <div className="glass-card" style={{ padding: '40px', textAlign: 'center' }}>
                    <p style={{ color: 'white', fontSize: '18px' }}>No pending requests.</p>
                    <Link to="/search" style={{ color: 'var(--gold-accent)', textDecoration: 'none', marginTop: '15px', display: 'inline-block' }}>
                        Find some Buds →
                    </Link>
                </div>
            ) : (
                requests.map((req) => (
                    <div key={req._id} className="glass-card" style={{ padding: '20px', marginBottom: '15px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Link to={`/user/${req.from?._id}`} style={{ display: 'flex', alignItems: 'center', gap: '15px', textDecoration: 'none', color: 'white' }}>
                            <div style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: 'var(--navy-light)', overflow: 'hidden', border: '2px solid var(--gold-accent)' }}>
                                {req.from?.profileImage ? (
                                    <img src={`${API_URL}${req.from.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                ) : (
                                    <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'20px'}}>
                                        {req.from?.name ? req.from.name[0].toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '18px' }}>{req.from?.name}</h4>
                                <p style={{ margin: 0, fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>{req.from?.email}</p>
                            </div>
                        </Link>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button 
                                className="luxury-button" 
                                style={{ padding: '8px 15px', fontSize: '12px' }}
                                onClick={() => handleAction("accept", req.from?._id)}
                                disabled={processing === req.from?._id}
                            >
                                {processing === req.from?._id ? "..." : "Accept"}
                            </button>
                            <button 
                                className="luxury-button" 
                                style={{ padding: '8px 15px', fontSize: '12px', background: 'transparent', border: '1px solid rgba(255,255,255,0.3)' }}
                                onClick={() => handleAction("reject", req.from?._id)}
                                disabled={processing === req.from?._id}
                            >
                                {processing === req.from?._id ? "..." : "Reject"}
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default FriendInbox;