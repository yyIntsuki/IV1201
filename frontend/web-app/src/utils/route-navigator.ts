import type { Role } from "@/types/role";
import ROUTES from "@/constants/routes";

const roleRoutes: Record<Role, string> = { applicant: ROUTES.APPLICANT, recruiter: ROUTES.RECRUITER };

/**
 * Gets the correct route based on role.
 * @param role user role
 * @returns the corresponding route
 */
const getRoute = (role: Role | null): string => {
    if (!role) return ROUTES.LOGIN;
    return roleRoutes[role] || ROUTES.LOGIN;
};

export default getRoute;
