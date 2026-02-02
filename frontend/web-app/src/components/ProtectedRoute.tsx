import React from "react";
import { Navigate, useLocation, Outlet } from "react-router";

/**
 * ProtectedRoute component to guard routes that require authentication.
 * Also handles authorization based on account type.
 */
const ProtectedRoute: React.FC = () => {
    const location = useLocation();
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const accountType = localStorage.getItem("accountType");

    if (!isLoggedIn)
        return <Navigate to="/login" state={{ from: location }} replace />;

    const currentPath = location.pathname;

    if (accountType === "applicant" && currentPath === "/recruiter") {
        return <Navigate to="/applicant" replace />;
    }

    if (accountType === "recruiter" && currentPath === "/applicant") {
        return <Navigate to="/recruiter" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
