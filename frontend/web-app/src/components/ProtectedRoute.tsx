import React from "react";
import { Navigate, useLocation, Outlet } from "react-router";

/**
 * ProtectedRoute component to guard routes that require authentication.
 */
const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn)
        return <Navigate to="/login" state={{ from: location }} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
