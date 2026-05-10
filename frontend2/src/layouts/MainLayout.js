import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const MainLayout = () => {
    const location = useLocation();
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/';

    return (
        <div className="main-layout">
            {isAuthPage ? (
                <div className="auth-bg" style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'url("/auth-bg.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: -1
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.4)'
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