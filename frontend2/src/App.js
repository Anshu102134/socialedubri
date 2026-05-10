import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./contexts/AuthContext";

import { LoginPage } from "./pages/LoginPage";
import Feed from "./pages/Feed";
import FriendInbox from "./pages/FriendInbox";
import HomePage from "./pages/HomePage";
import MainLayout from "./layouts/MainLayout";
import RegisterForm from "./pages/Registration";
import SearchPage from "./pages/SearchPage";
import ProfilePage from "./pages/ProfilePage";
import UserProfile from "./pages/UserProfile";

function App() {

    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <Routes>

            {/* Layout wrapper */}
            <Route path="/" element={<MainLayout />}>

                {/* Root → always go to feed or login */}
                <Route
                    index
                    element={
                        user ? (
                            <Navigate to="/feed" replace />
                        ) : (
                            <RegisterForm />
                        )
                    }
                />

                {/* Public routes */}
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterForm />} />

                {/* Protected routes */}
                <Route
                    path="feed"
                    element={
                        user ? <Feed /> : <Navigate to="/login" replace />
                    }
                />

                <Route
                    path="friends"
                    element={
                        user ? <FriendInbox /> : <Navigate to="/login" replace />
                    }
                />

                 <Route
                     path="search"
                     element={
                         user ? <SearchPage /> : <Navigate to="/login" replace />
                     }
                 />
 
                 <Route
                     path="profile"
                     element={
                         user ? <ProfilePage /> : <Navigate to="/login" replace />
                     }
                 />

                 <Route
                     path="user/:id"
                     element={
                         user ? <UserProfile /> : <Navigate to="/login" replace />
                     }
                 />

                <Route
                    path="home"
                    element={
                        user ? <HomePage /> : <Navigate to="/login" replace />
                    }
                />

            </Route>

            {/* fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
    );
}

export default App;