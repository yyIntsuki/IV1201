import React from "react";

/**
 * Navigation component with logout button positioned at top right using only positioning.
 */
const Navigation: React.FC = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const handleLogout = () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("accountType");
        window.location.href = "/login";
    };

    if (!isLoggedIn) return null;

    return (
        <div
            style={{
                position: "fixed",
                top: "0",
                right: "0",
                padding: "10px",
            }}>
            <button onClick={handleLogout}>Logout</button>
        </div>
    );
};

export default Navigation;
