import ROLES from "@/constants/roles";
import type { Role } from "@/types/role";

const ID_TO_ROLE = Object.fromEntries(Object.entries(ROLES).map(([role, id]) => [id, role])) as Record<number, Role>;

/**
 * Parses a role number into a string. To be used directly after getting the JSON data from API.
 * @param roleId role number identifier
 * @returns the coresponding role string
 */
const parseRole = (roleId: number | null): Role | null => {
    if (!roleId) return null;
    return ID_TO_ROLE[roleId] ?? null;
};

export default parseRole;
