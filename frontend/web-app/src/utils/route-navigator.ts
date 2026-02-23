import type { Role } from "@/types/role";
import ROUTES from "@/constants/routes";

const roleRoutes: Record<Role, string> = { applicant: ROUTES.APPLICANT, recruiter: ROUTES.RECRUITER };

/**
 * Returns the route path for a given role.
 * If the role is null, defaults to the login route.
 * If the role is not found in the roleRoutes object, defaults to the login route.
 *
 * @param role - The role to get the route path for
 * @returns The route path for the given role
 */
const getRoute = (role: Role | null): string => {
    if (!role) return ROUTES.LOGIN;
    return roleRoutes[role] || ROUTES.LOGIN;
};

export default getRoute;
