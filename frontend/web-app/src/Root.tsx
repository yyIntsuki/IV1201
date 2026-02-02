import { BrowserRouter as Router, Routes, Route } from "react-router";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applicant from "./pages/Applicant";
import Recruiter from "./pages/Recruiter";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";

/**
 * The root component that sets up routing for the application.
 */
function Root() {
    return (
        <Router>
            <Navigation />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/applicant" element={<Applicant />} />
                    <Route path="/recruiter" element={<Recruiter />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default Root;
