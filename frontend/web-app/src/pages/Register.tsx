import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router";
import { accountService } from "../services/account.service";
import type { Account } from "../types/accountTypes";

/**
 * The page for applicants to register for the job application system.
 */
const Register = () => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [personNumber, setPersonNumber] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        if (
            !firstName ||
            !lastName ||
            !email ||
            !personNumber ||
            !username ||
            !password
        ) {
            setError("All fields are required.");
            return;
        }

        if (accountService.usernameExists(username)) {
            setError("Username already exists");
            return;
        }

        const newAccount: Account = {
            firstName,
            lastName,
            email,
            personNumber,
            username,
            password,
            accountType: "applicant",
        };

        accountService.create(newAccount);

        login("applicant");
        navigate("/applicant", { replace: true });

        setSuccess(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPersonNumber("");
        setUsername("");
        setPassword("");
    };

    if (success) {
        return (
            <div>
                <h1>Registration Successful!</h1>
                <p>
                    You are now logged in as an applicant and redirected to your
                    dashboard.
                </p>
            </div>
        );
    }

    return (
        <div>
            <h1>Register</h1>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        First Name:
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Last Name:
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Personal Number:
                        <input
                            type="text"
                            value={personNumber}
                            onChange={(e) => setPersonNumber(e.target.value)}
                        />
                    </label>
                </div>

                <div>
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
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
                        />
                    </label>
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
