import React, { useState } from "react";

/**
 * The page for handling login.
 * Currently only a dummy page with some minor authentication logic.
 */
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("applicant");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (username === "admin" && password === "password") {
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("accountType", accountType);

            window.location.href =
                accountType === "applicant" ? "/applicant" : "/recruiter";
        } else setError("Invalid username or password");
    };

    return (
        <div>
            <h1>Login</h1>
            <p>Please log in to access the application</p>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Account Type:
                        <select
                            value={accountType}
                            onChange={(e) => setAccountType(e.target.value)}>
                            <option value="applicant">Applicant</option>
                            <option value="recruiter">Recruiter</option>
                        </select>
                    </label>
                </div>

                <button type="submit">Login</button>
                <div>{error && error}</div>
            </form>

            <div>Demo credentials: username: admin, password: password</div>
        </div>
    );
};

export default Login;
