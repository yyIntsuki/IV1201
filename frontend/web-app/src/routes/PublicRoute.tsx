import { Navigate, Outlet } from "react-router";
import useAuth from "@/hooks/use-auth";
import getRoute from "@/utils/route-navigator";

/**
 * A route guard that redirects authenticated users away from public routes, sending them to their role-specific page instead.
 * If the user is not logged in, the route allows them to pass through, rendering the wrapped component.
 */
const PublicRoute = () => {
    const { isLoggedIn, role } = useAuth();

    if (isLoggedIn) return <Navigate to={getRoute(role)} replace />;

    return <Outlet />;
};

export default PublicRoute;
