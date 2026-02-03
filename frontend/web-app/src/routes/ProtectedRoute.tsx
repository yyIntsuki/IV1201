import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth/useAuth";

interface Props {
    allowedRoles?: ("applicant" | "recruiter")[];
}

/**
 * ProtectedRoute component to guard routes that require authentication.
 * Also handles authorization based on account type.
 */
const ProtectedRoute = ({ allowedRoles }: Props) => {
    const { isLoggedIn, accountType } = useAuth();

    if (!isLoggedIn) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(accountType!)) {
        return (
            <Navigate
                to={accountType === "recruiter" ? "/recruiter" : "/applicant"}
                replace
            />
        );
    }

    return <Outlet />;
};

export default ProtectedRoute;
