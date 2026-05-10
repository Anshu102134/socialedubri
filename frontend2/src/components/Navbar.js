import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import Search from './Search';
import { API_URL } from '../config';

const Navbar = () => {
    const { user, setUser, loading } = useContext(AuthContext);

    if (loading) {
        return <nav className="navbar"><p>Loading...</p></nav>;
    }

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('token'); // Clear JWT from storage
    };

    return (
        <nav className="navbar" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(10px)', background: 'linear-gradient(135deg, rgba(11,31,58,0.95) 0%, rgba(26,47,74,0.95) 100%)', padding: '10px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <div className="title" style={{ fontSize: '24px' }}>Edubridge</div>

                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'center', margin: '0 20px' }}>
                    <Search />
                </div>

                <ul className="nav-list" style={{ display: 'flex', listStyle: 'none', gap: '20px', margin: 0, padding: 0 }}>
                    {!user && (
                        <>
                            <li><Link to="/register" className="nav-link">Register</Link></li>
                            <li><Link to="/login" className="nav-link">Login</Link></li>
                        </>
                    )}

                    {user && (
                        <>
                            <li><Link to="/home" className="nav-link">Home</Link></li>
                            <li>
                                <Link to="/friends" className="nav-link" style={{ position: 'relative' }}>
                                    Friends
                                    {user.pendingCount > 0 && (
                                        <span style={{ 
                                            position: 'absolute', 
                                            top: '-8px', 
                                            right: '-12px', 
                                            backgroundColor: 'var(--gold-accent)', 
                                            color: 'var(--navy-main)', 
                                            fontSize: '10px', 
                                            fontWeight: 'bold', 
                                            width: '16px', 
                                            height: '16px', 
                                            borderRadius: '50%', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                                            fontFamily: 'Montserrat'
                                        }}>
                                            {user.pendingCount}
                                        </span>
                                    )}
                                </Link>
                            </li>
                            <li><Link to="/search" className="nav-link">Search</Link></li>
                            <li><Link to="/profile" className="nav-link">Profile</Link></li>
                        </>
                    )}
                </ul>

                {user && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '15px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--gold-accent)', overflow: 'hidden', border: '1px solid var(--white)' }}>
                                {user.profileImage ? (
                                    <img src={`${API_URL}${user.profileImage}`} alt="Profile" style={{width:'100%', height:'100%', objectFit:'cover'}} />
                                ) : (
                                    <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontSize:'14px', fontWeight: 'bold'}}>
                                        {user.name ? user.name[0].toUpperCase() : 'U'}
                                    </div>
                                )}
                            </div>
                            <span style={{ fontSize: '13px', color: 'var(--white)', fontWeight: '400', whiteSpace: 'nowrap' }}>{user.name}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            style={{ background: 'transparent', border: '1px solid var(--gold-accent)', color: 'var(--gold-light)', padding: '5px 12px', borderRadius: '4px', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: '11px', textTransform: 'uppercase', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
                            onMouseOver={(e) => { e.target.style.background = 'var(--gold-accent)'; e.target.style.color = 'var(--navy-main)'; }}
                            onMouseOut={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--gold-light)'; }}
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;