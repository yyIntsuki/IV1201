import { Navigate, Outlet } from "react-router";
import useAuth from "@/hooks/use-auth";
import type { Role } from "@/types/role";

/**
 * ProtectedRoute component to guard routes that require authentication, so that unauthorized users cannot use protected pages.
 * Also ensures recruiters cannot gain access to applicant's page, and vice versa.
 */
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(role!))
        return <Navigate to={role === "recruiter" ? "/recruiter" : "/applicant"} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
