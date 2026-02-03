const Home = () => {
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
        </div>
    );
};

export default Home;
