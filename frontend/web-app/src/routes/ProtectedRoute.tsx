import { Navigate, Outlet } from "react-router";
import useAuth from "@/hooks/use-auth";
import type { Role } from "@/types/role";
import getRoute from "@/utils/route-navigator";
import ROUTES from "@/constants/routes";

/**
 * ProtectedRoute component to guard routes that require authentication, so that unauthorized users cannot use protected pages.
 * Also ensures recruiters cannot gain access to applicant's page, and vice versa.
 */
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;

    if (allowedRoles && !allowedRoles.includes(role!)) return <Navigate to={getRoute(role)} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
