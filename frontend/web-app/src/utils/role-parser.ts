import ROLES from "@/constants/roles";
import type { Role } from "@/types/role";

/**
 * Parses a role number into a string. To be used directly after getting the JSON data from API.
 * @param roleId a number. For details see constants/role.
 * @returns the role in string form.
 */
const parseRole = (roleId: number): Role => {
    const role = ROLES[roleId - 1];
    if (!role) throw new Error("Invalid role ID");
    return role as Role;
};

export default parseRole;
