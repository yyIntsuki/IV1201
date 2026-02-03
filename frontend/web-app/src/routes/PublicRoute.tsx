import { Navigate, Outlet } from "react-router";
import { useAuth } from "../hooks/useAuth";

const PublicRoute = () => {
    const { isLoggedIn, accountType } = useAuth();

    if (isLoggedIn) return <Navigate to={accountType === "recruiter" ? "/recruiter" : "/applicant"} replace />;

    return <Outlet />;
};

export default PublicRoute;
