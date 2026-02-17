// frontend/web-app/src/utils/navigation.ts
import type { Role } from "@/types/role";
import ROUTES from "@/constants/routes";

/**
 * Gets the correct route based on role.
 * @param role user role
 * @returns the corresponding route
 */
const getRoute = (role: Role | null): string => {
    if (role === "recruiter") return ROUTES.RECRUITER;
    if (role === "applicant") return ROUTES.APPLICANT;
    return ROUTES.LOGIN;
};

export default getRoute;
