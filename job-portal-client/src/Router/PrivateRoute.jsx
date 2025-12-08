
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthProvider';

/**
 * This component acts as a gatekeeper for routes that require admin privileges.
 */
const PrivateRoute = ({ children }) => {
    const { user, userRole, loading, roleLoading } = useContext(AuthContext);
    const location = useLocation();

    // While authentication status and role are being determined, show a loading indicator.
    if (loading || roleLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-xl font-medium">Đang tải...</p>
            </div>
        );
    }

    // If the user is logged in and their role is 'admin', allow access to the requested route.
    if (user && userRole === 'admin') {
        return children;
    }

    // If the user is not an admin, redirect them to the login page.
    // The current location is passed in state so they can be redirected back after logging in.
    return <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
