import { BrowserRouter, Routes, Route } from "react-router";

import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Applicant from "@/pages/Applicant";
import Recruiter from "@/pages/Recruiter";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

import LogoutButton from "@/components/LogoutButton";

/**
 * The root component that sets up routing for the application.
 * Only logged in users can access protected routes, otherwise they are redirected to login.
 * Public routes are accessible only to users who are not logged in.
 */
function Router() {
    return (
        <BrowserRouter>
            <LogoutButton />
            <Routes>
                <Route element={<PublicRoute />}>
                    <Route index element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["applicant"]} />}>
                    <Route path="/applicant" element={<Applicant />} />
                </Route>

                <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
                    <Route path="/recruiter" element={<Recruiter />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
