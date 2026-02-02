import React from "react";
import { Link } from "react-router";

/**
 * Currently only used as a debug feature to navigate between pages when logged in.
 */
const Navigation: React.FC = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const accountType = localStorage.getItem("accountType");

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accountType");
        window.location.href = "/login";
    };

    if (!isLoggedIn) return null;

    return (
        <nav>
            {accountType === "applicant" ? (
                <Link to="/applicant">Applicant</Link>
            ) : (
                <Link to="/recruiter">Recruiter</Link>
            )}
            <Link to="/register">Register</Link>
            <button onClick={handleLogout}>Logout</button>
        </nav>
    );
};

export default Navigation;
