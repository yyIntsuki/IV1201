import { useState } from "react";
import { healthCheck } from "../api/health.api";

const Home = () => {
    const [corsResult, setCorsResult] = useState<string | null>(null);
    const [corsError, setCorsError] = useState<string | null>(null);

    const testCors = async () => {
        setCorsResult(null);
        setCorsError(null);

        try {
            const data = await healthCheck();
            setCorsResult(JSON.stringify(data));
        } catch {
            setCorsError("CORS request failed");
        }
    };

    return (
        <div>
            <h1>Amusement Park</h1>
            <h3>Recruitement Application</h3>
            <p>Login or register to continue.</p>
            <div>
                <button onClick={() => (window.location.href = "/login")}>
                    Login
                </button>
                <button onClick={() => (window.location.href = "/register")}>
                    Register
                </button>
            </div>

            <div>
                <h2>CORS Test</h2>
                <button onClick={testCors}>Test backend connection</button>

                {corsResult && <p style={{ color: "green" }}>{corsResult}</p>}

                {corsError && <p style={{ color: "red" }}>{corsError}</p>}
            </div>
        </div>
    );
};

export default Home;
