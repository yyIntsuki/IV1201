import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { accountService } from "../services/account.service";

/**
 * The page for handling login.
 * Currently only a dummy page with some minor authentication logic.
 */
const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const account = accountService.findByCredentials(username, password);

        if (!account) {
            setError("Invalid username or password");
            return;
        }

        login(account.accountType);

        navigate(
            account.accountType === "recruiter" ? "/recruiter" : "/applicant",
            { replace: true },
        );
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

                <button type="submit">Login</button>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>

            <div>
                Don't have an account? <a href="/register">Register here</a>.
            </div>

            <div>
                <h3>Sample accounts for testing:</h3>
                <p>
                    username: <b>app</b>; password: <b>licant</b>
                </p>
                <p>
                    username: <b>rec</b>; password: <b>ruiter</b>
                </p>
            </div>
        </div>
    );
};

export default Login;
