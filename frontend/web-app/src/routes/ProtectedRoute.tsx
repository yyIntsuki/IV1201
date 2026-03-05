import { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router";
import useAuth from "@/hooks/use-auth";
import useLoading from "@/hooks/use-loading";
import useError from "@/hooks/use-error";
import fetchUserDataApi from "@/api/fetch-user-data-api";
import type { Role } from "@/types/role";
import ROUTES from "@/constants/routes";
import getRoute from "@/utils/route-navigator";
import { getUserIdFromJwt } from "@/utils/jwt-decoder";

/**
 * A route that checks if the user is logged in, has the required role, and has completed their profile.
 *
 * Authentication flow:
 * 1. If not logged in → redirect to login
 * 2. If logged in but wrong role → redirect to their role's page
 * 3. If logged in but profile incomplete → redirect to complete account page
 * 4. If all checks pass → render the protected content
 *
 * @param allowedRoles - An array of allowed roles for this route.
 * @param requireCompleteProfile - Whether to check if user has complete profile (default: true)
 * @returns A React element to be rendered in the route
 */
const ProtectedRoute = ({
    allowedRoles,
    requireCompleteProfile = true,
}: {
    allowedRoles?: Role[];
    requireCompleteProfile?: boolean;
}) => {
    const { isLoggedIn, role, token } = useAuth();
    const { startLoading, stopLoading } = useLoading();
    const { showApiError } = useError();
    const location = useLocation();

    const [profileCheckComplete, setProfileCheckComplete] = useState(false);
    const [hasCompleteProfile, setHasCompleteProfile] = useState(false);

    useEffect(() => {
        const checkProfileCompleteness = async () => {
            if (!isLoggedIn || !requireCompleteProfile || location.pathname === ROUTES.COMPLETE_ACCOUNT) {
                setProfileCheckComplete(true);
                setHasCompleteProfile(true);
                return;
            }

            const userId = getUserIdFromJwt(token || "");
            if (!userId) {
                setProfileCheckComplete(true);
                setHasCompleteProfile(false);
                return;
            }

            try {
                startLoading();

                const userData = await fetchUserDataApi(userId);

                const isComplete = !!(
                    userData.firstName &&
                    userData.lastName &&
                    userData.personNumber &&
                    userData.email &&
                    userData.username
                );

                setHasCompleteProfile(isComplete);
                setProfileCheckComplete(true);
            } catch (error) {
                showApiError(error, "protected-route");
                setProfileCheckComplete(true);
                setHasCompleteProfile(false);
            } finally {
                stopLoading();
            }
        };

        void checkProfileCompleteness();
    }, [isLoggedIn, token, requireCompleteProfile, location.pathname, startLoading, stopLoading, showApiError]);

    if (!isLoggedIn) return <Navigate to={ROUTES.LOGIN} replace />;

    if (allowedRoles && !allowedRoles.includes(role!)) return <Navigate to={getRoute(role)} replace />;

    if (!profileCheckComplete) return null;

    if (!hasCompleteProfile)
        return <Navigate to={`${ROUTES.COMPLETE_ACCOUNT}?redirect=${encodeURIComponent(location.pathname)}`} replace />;

    return <Outlet />;
};

export default ProtectedRoute;
