import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
const MainLayout = () => {
    return (
        <div className="main-layout">
            <video autoPlay loop muted className="bg-video">
                <source src="/background-video.mp4" type="video/mp4" />
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