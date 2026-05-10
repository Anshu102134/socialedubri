import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { API_URL } from "../config";


const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(null);

    const [searchQuery, setSearchQuery] = useState(query || "");

    useEffect(() => {
        if (query) {
            const fetchResults = async () => {
                setLoading(true);
                try {
                    const res = await axiosClient.get(`/api/users/search?q=${encodeURIComponent(query)}`);
                    setResults(res.data);
                } catch (err) {
                    console.error("Error fetching search results:", err);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchResults();
            setSearchQuery(query);
        }
    }, [query]);

    const handleInternalSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
        // Manually trigger effect or just navigation is enough if component re-renders
        // Better yet, just use useNavigate
    };

    const handleAddFriend = async (receiverId) => {
        const token = localStorage.getItem("token");
        setSending(receiverId);
        try {
            const res = await fetch("http://localhost:5000/api/friendRequest/send", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ to: receiverId })
            });

            const data = await res.json();
            alert(res.ok ? "Friend request sent!" : data.message || "Failed to send");
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setSending(null);
        }
    };

    if (!query) return <p className="text-center">No search query provided.</p>;
    if (loading) return <p className="text-center">Loading results...</p>;

    return (
        <div className="search-container" style={{ padding: '40px 20px', maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '30px', marginBottom: '30px', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '20px', color: 'white' }}>Find New Buds</h2>
                <form onSubmit={handleInternalSearch} style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <input
                        type="text"
                        className="luxury-input"
                        style={{ maxWidth: '400px', background: 'rgba(255,255,255,0.1)', color: 'white' }}
                        placeholder="Enter name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="luxury-button" style={{ padding: '10px 25px' }}>
                        Search
                    </button>
                </form>
            </div>

            {query && (
                <h3 style={{ color: 'white', marginBottom: '20px', textAlign: 'center' }}>
                    Results for "{query}"
                </h3>
            )}

            {query && results.length === 0 ? (
                <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>No users found.</p>
            ) : (
                results.map((user) => (
                    <div key={user._id} className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', marginBottom: '15px' }}>
                        <Link to={`/user/${user._id}`} className="user-info" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                            <img
                                src={user.profileImage ? `${API_URL}${user.profileImage}` : "https://via.placeholder.com/40"}
                                alt={user.name}
                                style={{ width: '40px', height: '40px', borderRadius: '50%', marginRight: '15px', objectFit: 'cover' }}
                            />
                            <div>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>{user.name}</h3>
                                <p style={{ margin: 0, fontSize: '13px', color: '#777' }}>{user.email}</p>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {user.status === 'friends' ? (
                                <span style={{ color: 'var(--gold-accent)', fontWeight: '600', fontSize: '14px' }}>🤝 Buds</span>
                            ) : user.status === 'sent' ? (
                                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Request Sent</span>
                            ) : user.status === 'received' ? (
                                <button
                                    className="luxury-button"
                                    style={{ padding: '8px 15px', fontSize: '12px' }}
                                    onClick={() => handleAddFriend(user._id)} // Reuse send logic which now auto-accepts
                                >
                                    Accept
                                </button>
                            ) : (
                                <button
                                    className="luxury-button"
                                    style={{ padding: '8px 15px', fontSize: '12px' }}
                                    disabled={sending === user._id}
                                    onClick={() => handleAddFriend(user._id)}
                                >
                                    {sending === user._id ? "..." : "Add Friend"}
                                </button>
                            )}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default SearchPage;
