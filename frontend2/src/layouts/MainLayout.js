import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import backgroundVideo from '../background-video.mp4';

const MainLayout = () => {
    return (
        <div className="main-layout">
            <video autoPlay loop muted className="bg-video">
                <source src={backgroundVideo} type="video/mp4" />
            </video>
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