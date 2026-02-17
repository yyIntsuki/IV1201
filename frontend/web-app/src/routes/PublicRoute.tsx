import { Navigate, Outlet } from "react-router";
import useAuth from "@/hooks/use-auth";
import getRoute from "@/utils/route-navigator";

/**
 * PublicRoute ensures logged in users should stay in their respective pages.
 * Authorized users should not gain access to Login and Register for instance.
 */
const PublicRoute = () => {
    const { isLoggedIn, role } = useAuth();

    if (isLoggedIn) return <Navigate to={getRoute(role!)} replace />;

    return <Outlet />;
};

export default PublicRoute;
