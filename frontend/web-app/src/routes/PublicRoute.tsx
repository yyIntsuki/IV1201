import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/hooks/use-auth";

const PublicRoute = () => {
    const { isLoggedIn, role } = useAuth();

    if (isLoggedIn) return <Navigate to={role === "recruiter" ? "/recruiter" : "/applicant"} replace />;

    return <Outlet />;
};

export default PublicRoute;
