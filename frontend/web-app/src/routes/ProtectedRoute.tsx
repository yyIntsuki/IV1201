import { Navigate, Outlet } from "react-router";
import useAuth from "@/hooks/use-auth";
import type { Role } from "@/types/role";
import getRoute from "@/utils/route-navigator";
import ROUTES from "@/constants/routes";

/**
 * A route that checks if the user is logged in and if the user's role is included in the allowed roles.
 * If the user is not logged in, they are redirected to the login page. If the user's role is not included
 * in the allowed roles, they are redirected to their respective role's page.
 *
 * @param allowedRoles - An array of allowed roles for this route.
 * @returns A React element to be rendered in the route.
 */
const ProtectedRoute = ({ allowedRoles }: { allowedRoles?: Role[] }) => {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;

    if (allowedRoles && !allowedRoles.includes(role!)) return <Navigate to={getRoute(role)} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
