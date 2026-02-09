import { ROLES } from "@/constants/roles";
import type { Role } from "@/types/role";

/**
 * Parses a role number into a string.
 * @param roleId a number, either 1 for recruiter, or 2 for applicant.
 * @returns the role in string form
 */
export const parseRole = (roleId: number): Role => {
    const role = ROLES[roleId - 1];
    if (!role) throw new Error("Invalid role ID");
    return role as Role;
};