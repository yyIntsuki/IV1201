import type { Role } from "@/types/role";

export const ROLES_MAP: Record<number, Role> = {
    1: "recruiter",
    2: "applicant",
};

/**
 * Parses a role number into a string. To be used directly after getting the JSON data from API.
 * @param roleId role number identifier
 * @returns the coresponding role string
 */
export const parseRole = (roleId: number | null): Role | null => {
    if (!roleId) return null;
    return ROLES_MAP[roleId] ?? null;
};

export default parseRole;
