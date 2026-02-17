// frontend/web-app/src/utils/navigation.ts
import type { Role } from "@/types/role";

/**
 * Gets the correct route based on role.
 * @param role user role
 * @returns the corresponding route
 */
const getRoute = (role: Role | null): string => {
    if (role === "recruiter") return "/recruiter";
    if (role === "applicant") return "/applicant";
    return "/login"; // fallback if role is null
};

export default getRoute;
