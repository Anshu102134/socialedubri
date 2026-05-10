import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { API_URL } from '../config';

const Feed = () => {
    const { user, loading } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [text, setText] = useState("");
    const [mediaFile, setMediaFile] = useState(null);
    const [isPosting, setIsPosting] = useState(false);

    // Fetch posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axiosClient.get("/api/posts");
                setPosts(res.data);
            } catch (err) {
                console.error("Fetch posts error:", err);
            }
        };
        if (user) {
            fetchPosts();
        }
    }, [user]);

    // Create post
    const handleCreatePost = async (e) => {
        e.preventDefault();
        if (!text.trim() && !mediaFile) return;
        setIsPosting(true);
        try {
            const formData = new FormData();
            formData.append("text", text);
            if (mediaFile) {
                formData.append("media", mediaFile);
            }

            const res = await axiosClient.post("/api/posts", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setPosts([res.data.post, ...posts]);
            setText("");
            setMediaFile(null);
        } catch (err) {
            console.error("Create post error:", err);
            alert(err.response?.data?.message || "Failed to create post");
        } finally {
            setIsPosting(false);
        }
    };

    // Like post
    const likePost = async (postId) => {
        try {
            const res = await axiosClient.put(`/api/posts/${postId}/like`);
            setPosts((prev) =>
                prev.map((p) => (p._id === postId ? res.data.updatedPost : p))
            );
        } catch (err) {
            console.error("Like error:", err);
        }
    };

    // Add comment
    const addComment = async (postId, commentText) => {
        if (!commentText.trim()) return;
        try {
            const res = await axiosClient.post(`/api/posts/${postId}/comment`, { text: commentText });
            setPosts((prev) =>
                prev.map((p) => (p._id === postId ? res.data : p))
            );
        } catch (err) {
            console.error("Comment error:", err);
            alert(err.response?.data?.message || "Failed to add comment");
        }
    };

    // Delete post
    const handleDeletePost = async (postId) => {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await axiosClient.delete(`/api/posts/${postId}`);
            setPosts((prev) => prev.filter((p) => p._id !== postId));
        } catch (err) {
            console.error("Delete error:", err);
            alert("Failed to delete post");
        }
    };

    if (loading) return <p style={{textAlign:'center', marginTop:'50px'}}>Loading luxury experience...</p>;
    if (!user) return <Navigate to="/login" replace />;

    return (
        <div style={{ padding: '40px 20px', maxWidth: '680px', margin: '0 auto', paddingBottom: '100px' }}>
            
            {/* Create Post Section */}
            <div className="glass-card" style={{ padding: "25px", marginBottom: "30px" }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '50%', backgroundColor: 'var(--navy-light)', overflow: 'hidden', marginRight: '15px', border: '2px solid var(--gold-accent)' }}>
                        {user.profileImage ? (
                            <img src={`${API_URL}${user.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                        ) : (
                            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'20px'}}>
                                {user.name ? user.name[0].toUpperCase() : 'U'}
                            </div>
                        )}
                    </div>
                    <h3 style={{ margin: 0, fontSize: '18px' }}>Share something luxurious, {user.name}</h3>
                </div>

                <form onSubmit={handleCreatePost}>
                    <textarea
                        className="luxury-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="What's on your mind?..."
                        style={{ minHeight: "80px", resize: "vertical", marginBottom: '15px' }}
                    />
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <input 
                                type="file" 
                                id="media-upload" 
                                accept="image/*,video/*" 
                                style={{ display: 'none' }}
                                onChange={(e) => setMediaFile(e.target.files[0])}
                            />
                            <label htmlFor="media-upload" style={{ cursor: 'pointer', color: 'var(--navy-light)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontSize: '20px' }}>📷</span> {mediaFile ? mediaFile.name : 'Attach Image/Video'}
                            </label>
                        </div>
                        <button type="submit" className="luxury-button" disabled={isPosting}>
                            {isPosting ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </form>
            </div>

            {/* Posts Feed */}
            {posts?.length === 0 ? (
                <div className="glass-card" style={{ padding: '60px 40px', textAlign: 'center' }}>
                    <div style={{ fontSize: '60px', marginBottom: '20px' }}>🌟</div>
                    <h2 style={{ color: 'white', marginBottom: '15px' }}>Welcome to Edubridge</h2>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '18px', lineHeight: '1.6' }}>
                        Your feed looks a bit quiet! Start your journey by sharing your first luxurious moment or find some buds to see their updates.
                    </p>
                    <div style={{ marginTop: '30px' }}>
                        <Link to="/search" className="luxury-button" style={{ textDecoration: 'none' }}>
                            Find Buds →
                        </Link>
                    </div>
                </div>
            ) : (
                posts.map((post) => (
                    <div key={post._id} className="glass-card" style={{ padding: "25px", marginBottom: "25px" }}>
                        
                        {/* Post Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                            <Link to={`/user/${post.user?._id}`} style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--navy-light)', overflow: 'hidden', marginRight: '15px' }}>
                                    {post.user?.profileImage ? (
                                        <img src={`${API_URL}${post.user.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                    ) : (
                                        <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'18px'}}>
                                            {post.user?.name ? post.user.name[0].toUpperCase() : 'U'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0, color: 'var(--navy-main)', fontSize: '16px' }}>{post.user?.name || "Unknown User"}</h4>
                                    <small style={{ color: "var(--text-muted)", fontSize: '12px' }}>
                                        {post?.createdAt ? new Date(post.createdAt).toLocaleString() : ""}
                                    </small>
                                </div>
                            </Link>

                            {post.user?._id === user._id && (
                                <button 
                                    onClick={() => handleDeletePost(post._id)}
                                    style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '18px' }}
                                    title="Delete Post"
                                >
                                    🗑️
                                </button>
                            )}
                        </div>

                        {/* Post Text */}
                        <p style={{ fontSize: '15px', lineHeight: '1.6', marginBottom: '15px' }}>{post?.text}</p>

                        {/* Post Media */}
                        {post.mediaUrl && (
                            <div style={{ marginBottom: '15px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                {post.mediaType === 'video' ? (
                                    <video src={`${API_URL}${post.mediaUrl}`} controls style={{ width: '100%', display: 'block' }} />
                                ) : (
                                    <img src={`${API_URL}${post.mediaUrl}`} alt="Post content" style={{ width: '100%', display: 'block', objectFit: 'contain', maxHeight: '500px' }} />
                                )}
                            </div>
                        )}

                        {/* Actions */}
                        <div style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderBottom: '1px solid rgba(0,0,0,0.05)', padding: '10px 0', margin: '15px 0', display: 'flex' }}>
                            <button
                                onClick={() => likePost(post._id)}
                                style={{ background: 'transparent', border: 'none', color: 'var(--navy-light)', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}
                            >
                                <span style={{ color: post.likes?.includes(user._id) ? '#ff4d4d' : 'inherit' }}>
                                    {post.likes?.includes(user._id) ? '❤️' : '🤍'}
                                </span> 
                                {post?.likes?.length || 0} Likes
                            </button>
                        </div>

                        {/* Comments Section */}
                        <div style={{ marginTop: "15px" }}>
                            {post.comments?.map((c) => (
                                <div key={c._id} style={{ display: 'flex', marginBottom: '12px', background: 'rgba(255,255,255,0.5)', padding: '10px', borderRadius: '8px' }}>
                                    <div style={{ width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--navy-light)', overflow: 'hidden', marginRight: '10px', flexShrink: 0 }}>
                                        {c.user?.profileImage ? (
                                            <img src={`${API_URL}${c.user.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                        ) : (
                                            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'14px'}}>
                                                {c.user?.name ? c.user.name[0].toUpperCase() : 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <strong style={{ fontSize: '13px', color: 'var(--navy-main)' }}>{c.user?.name || "User"}</strong>
                                        <p style={{ margin: '2px 0 0 0', fontSize: '14px' }}>{c.text}</p>
                                    </div>
                                </div>
                            ))}

                            <div style={{ display: 'flex', marginTop: '15px', gap: '10px' }}>
                                <input
                                    className="luxury-input"
                                    type="text"
                                    placeholder="Add a comment..."
                                    value={post.newComment || ""}
                                    onChange={(e) =>
                                        setPosts((prev) =>
                                            prev.map((p) =>
                                                p._id === post._id ? { ...p, newComment: e.target.value } : p
                                            )
                                        )
                                    }
                                    onKeyPress={(e) => {
                                        if(e.key === 'Enter') {
                                            addComment(post._id, post.newComment || "");
                                            setPosts((prev) => prev.map((p) => p._id === post._id ? { ...p, newComment: "" } : p));
                                        }
                                    }}
                                />
                                <button 
                                    className="luxury-button" 
                                    style={{ padding: '0 20px' }}
                                    onClick={() => {
                                        addComment(post._id, post.newComment || "");
                                        setPosts((prev) => prev.map((p) => p._id === post._id ? { ...p, newComment: "" } : p));
                                    }}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Feed;
