import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const MainLayout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

    return (
        <div className="main-layout" style={{ backgroundColor: isAuthPage ? 'transparent' : 'black', minHeight: '100vh' }}>
            {isAuthPage ? (
                <div className="auth-bg" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundImage: 'url("/auth-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    zIndex: -1
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.5)', // Slightly darker for better form visibility
                        backdropFilter: 'blur(2px)' // Adding a tiny blur for a premium feel
                    }}></div>
                </div>
            ) : (
                <video autoPlay loop muted className="bg-video">
                    <source src="/luxury-bg.mp4" type="video/mp4" />
                </video>
            )}
            <header>
                <Navbar />
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <Footer />
            </footer>
        </div>
    );
};

export default MainLayout;