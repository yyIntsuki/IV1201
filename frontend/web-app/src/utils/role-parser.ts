import ROLES from "@/constants/roles";
import type { Role } from "@/types/role";

const ID_TO_ROLE = Object.fromEntries(Object.entries(ROLES).map(([role, id]) => [id, role])) as Record<number, Role>;

/**
 * Maps a role ID to its corresponding role string.
 * If the role ID is null or invalid, returns null.
 *
 * @param roleId - The role ID to map
 * @returns The role string corresponding with the role ID, or null if invalid
 */
const parseRole = (roleId: number | null): Role | null => {
    if (!roleId) return null;
    return ID_TO_ROLE[roleId] ?? null;
};

export default parseRole;
