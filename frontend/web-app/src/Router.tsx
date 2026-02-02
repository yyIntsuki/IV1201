import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Applicant from "./pages/Applicant";
import Recruiter from "./pages/Recruiter";
import ProtectedRoute from "./components/ProtectedRoute";
import Navigation from "./components/Navigation";

/**
 * The root component that sets up routing for the application.
 */
function Router() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route element={<ProtectedRoute />}>
                    <Route path="/applicant" element={<Applicant />} />
                    <Route path="/recruiter" element={<Recruiter />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
