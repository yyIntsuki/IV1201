import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

interface Props {
    allowedRoles?: ("applicant" | "recruiter")[];
}

/**
 * ProtectedRoute component to guard routes that require authentication.
 * Also handles authorization based on account type.
 */
const ProtectedRoute = ({ allowedRoles }: Props) => {
    const { isLoggedIn, role } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(role!))
        return <Navigate to={role === "recruiter" ? "/recruiter" : "/applicant"} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
