import React from "react";

/**
 * Currently only used as a debug feature to navigate between pages when logged in.
 */
const Navigation: React.FC = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accountType");
        window.location.href = "/login";
    };

    if (!isLoggedIn) return null;

    return <button onClick={handleLogout}>Logout</button>;
};

export default Navigation;
