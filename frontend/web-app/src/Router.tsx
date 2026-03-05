import { BrowserRouter, Routes, Route } from "react-router";
import ROUTES from "@/constants/routes";

import MainLayout from "@/layout/MainLayout";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Applicant from "@/pages/Applicant";
import Recruiter from "@/pages/Recruiter";
import NotFound from "@/pages/NotFound";
import CompleteAccount from "@/pages/CompleteAccount";

import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicRoute from "@/routes/PublicRoute";

/**
 * The root component that sets up routing for the application.
 * Only logged in users can access protected routes, otherwise they are redirected to login.
 * Public routes are accessible only to users who are not logged in.
 */
function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path={ROUTES.COMPLETE_ACCOUNT} element={<CompleteAccount />} />

                    <Route element={<PublicRoute />}>
                        <Route index element={<Home />} />
                        <Route path={ROUTES.LOGIN} element={<Login />} />
                        <Route path={ROUTES.REGISTER} element={<Register />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["applicant"]} />}>
                        <Route path={ROUTES.APPLICANT} element={<Applicant />} />
                    </Route>

                    <Route element={<ProtectedRoute allowedRoles={["recruiter"]} />}>
                        <Route path={ROUTES.RECRUITER} element={<Recruiter />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
